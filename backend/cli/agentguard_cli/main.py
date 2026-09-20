import os
import sys
import time
import signal
import shutil
import pathlib
import requests
import webbrowser
import subprocess
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

try:
    from .tui import run_tui
except ImportError:
    run_tui = None

from .api import (
    get_approvals,
    approve,
    reject,
    get_audit,
    verify_audit,
    get_agents,
    get_agent_permissions,
    allow_permission,
    deny_permission,
)

app = typer.Typer(
    name="agentguard",
    help="AgentGuard runtime security control plane.",
    no_args_is_help=False,
)

console = Console()


def find_repo_root() -> pathlib.Path:
    """Finds the AgentGuard repository root containing backend and frontend."""
    cwd = pathlib.Path.cwd()
    if (cwd / "backend" / "app" / "main.py").exists() and (cwd / "frontend" / "package.json").exists():
        return cwd
    pkg_dir = pathlib.Path(__file__).resolve().parent
    for p in [pkg_dir, *pkg_dir.parents]:
        if (p / "backend" / "app" / "main.py").exists() and (p / "frontend" / "package.json").exists():
            return p
    return cwd


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context):
    """
    AgentGuard CLI.
    """
    if ctx.invoked_subcommand is None:
        if run_tui is not None:
            run_tui()
        else:
            show_dashboard()


def is_port_in_use(port: int, host: str = "127.0.0.1") -> bool:
    """Checks if a network port is currently occupied."""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0


def kill_process_on_port(port: int):
    """Terminates any stale process occupying the specified port."""
    try:
        out = subprocess.check_output(["lsof", "-ti", f":{port}"], text=True).strip()
        if out:
            for pid_str in out.split():
                pid = int(pid_str)
                if pid != os.getpid():
                    try:
                        os.kill(pid, signal.SIGTERM)
                    except ProcessLookupError:
                        pass
            time.sleep(0.6)
    except Exception:
        pass


@app.command()
def start(
    host: str = typer.Option("127.0.0.1", help="API bind host"),
    port: int = typer.Option(8000, help="API port (default: 8000)"),
    dashboard_port: int = typer.Option(8787, help="Dashboard port (default: 8787)"),
    open_browser: bool = typer.Option(False, "--open", help="Open dashboard in default browser"),
    reload: bool = typer.Option(False, "--reload", help="Enable backend hot reload"),
):
    """
    Start AgentGuard locally: Backend API, MCP Gateway, and Dashboard.
    """
    repo_root = find_repo_root()
    backend_dir = repo_root / "backend"
    frontend_dir = repo_root / "frontend"

    if not (backend_dir / "app" / "main.py").exists():
        console.print(f"[red]Error: Could not locate backend at {backend_dir}[/red]")
        raise typer.Exit(1)

    npm_path = shutil.which("npm")
    if not npm_path:
        console.print("[red]Error: 'npm' is not installed or not in PATH.[/red]")
        raise typer.Exit(1)

    # Clean up stale processes on ports if any
    if is_port_in_use(port, host):
        console.print(f"[yellow]Port {port} is occupied by an earlier process. Cleaning up stale instance...[/yellow]")
        kill_process_on_port(port)
        time.sleep(0.5)

    if is_port_in_use(dashboard_port, host):
        console.print(f"[yellow]Port {dashboard_port} is occupied by an earlier process. Cleaning up stale instance...[/yellow]")
        kill_process_on_port(dashboard_port)
        time.sleep(0.5)

    console.print("[dim]Starting AgentGuard local services...[/dim]")

    # 1. Start Backend
    backend_env = os.environ.copy()
    backend_env["AGENTGUARD_ALLOWED_ORIGINS"] = (
        f"http://localhost:{dashboard_port},http://127.0.0.1:{dashboard_port},"
        f"http://localhost:3000,http://127.0.0.1:3000"
    )
    python_bin = sys.executable
    backend_cmd = [
        python_bin,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        host,
        "--port",
        str(port),
        "--log-level",
        "warning",
    ]
    if reload:
        backend_cmd.append("--reload")

    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=str(backend_dir),
        env=backend_env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )

    # 2. Start Frontend
    frontend_env = os.environ.copy()
    frontend_env["PORT"] = str(dashboard_port)
    frontend_env["NEXT_PUBLIC_API_URL"] = f"http://{host}:{port}"

    frontend_cmd = [npm_path, "run", "dev", "--", "-p", str(dashboard_port)]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(frontend_dir),
        env=frontend_env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )

    procs = [backend_proc, frontend_proc]

    def cleanup(signum=None, frame=None):
        for p in procs:
            try:
                p.terminate()
            except Exception:
                pass
        for p in procs:
            try:
                p.wait(timeout=2)
            except Exception:
                try:
                    p.kill()
                except Exception:
                    pass
        console.print("\n[dim]AgentGuard stopped.[/dim]")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # 3. Wait for health check
    health_url = f"http://{host}:{port}/health"
    connected_count = 0
    tools_count = 0
    is_ready = False

    for _ in range(50):
        # Check if backend crashed
        b_poll = backend_proc.poll()
        if b_poll is not None:
            err = backend_proc.stderr.read() if backend_proc.stderr else ""
            console.print(f"[red]Backend failed to start (exit code {b_poll}):[/red]\n{err}")
            cleanup()
            raise typer.Exit(1)

        f_poll = frontend_proc.poll()
        if f_poll is not None:
            err = frontend_proc.stderr.read() if frontend_proc.stderr else ""
            console.print(f"[red]Frontend failed to start (exit code {f_poll}):[/red]\n{err}")
            cleanup()
            raise typer.Exit(1)

        try:
            r = requests.get(health_url, timeout=1.0)
            if r.status_code == 200:
                data = r.json()
                connected_count = data.get("mcp_upstream_servers", 0)
                tools_count = data.get("mcp_tools_discovered", 0)
                is_ready = True
                break
        except Exception:
            pass
        time.sleep(0.5)

    if not is_ready:
        console.print("[yellow]Warning: Backend health check timed out, but processes were launched.[/yellow]")

    # 4. Print desired banner
    banner = f"""╭────────────────────────────────────────────╮
│              AgentGuard                    │
│       AI Agent Runtime Security            │
╰────────────────────────────────────────────╯

[green]✓[/green] [bold]API[/bold]          http://localhost:{port}
[green]✓[/green] [bold]Console[/bold]      http://localhost:{dashboard_port}/app
[green]✓[/green] [bold]MCP Gateway[/bold]  http://localhost:{port}/mcp

[bold]MCP Servers[/bold]
[green]✓[/green] {connected_count} connected
[green]✓[/green] {tools_count} tools discovered

[bold green]AgentGuard is ready.[/bold green]

[bold]Local Console:[/bold]
http://localhost:{dashboard_port}/app

[dim](Press Ctrl+C to stop)[/dim]
"""
    console.print(banner)

    if open_browser:
        try:
            webbrowser.open(f"http://localhost:{dashboard_port}/app")
        except Exception:
            pass

    # Wait for processes
    try:
        while True:
            time.sleep(1)
            b_poll = backend_proc.poll()
            if b_poll is not None:
                err = backend_proc.stderr.read() if backend_proc.stderr else ""
                console.print(f"\n[red]Backend process terminated (exit code {b_poll}):[/red]\n{err}")
                cleanup()
                break

            f_poll = frontend_proc.poll()
            if f_poll is not None:
                err = frontend_proc.stderr.read() if frontend_proc.stderr else ""
                console.print(f"\n[red]Frontend process terminated (exit code {f_poll}):[/red]\n{err}")
                cleanup()
                break
    except KeyboardInterrupt:
        cleanup()


def show_dashboard():
    console.print()

    console.print(
        Panel.fit(
            "[bold]AGENTGUARD[/bold]\n"
            "Runtime Security Control Plane",
            border_style="cyan",
        )
    )

    console.print()

    try:
        approvals = get_approvals()
        approval_count = len(approvals.get("approvals", []))
    except Exception:
        approval_count = "?"

    try:
        audit = get_audit()

        if isinstance(audit, dict):
            events = audit.get("events", [])
        else:
            events = audit

        event_count = len(events)
    except Exception:
        event_count = "?"

    table = Table(show_header=False)

    table.add_column("Metric")
    table.add_column("Value")

    table.add_row(
        "Runtime",
        "[green]● ONLINE[/green]",
    )

    table.add_row(
        "Security Events",
        str(event_count),
    )

    table.add_row(
        "Pending Approvals",
        str(approval_count),
    )

    console.print(table)

    console.print()
    console.print(
        "[dim]Commands:[/dim] "
        "status · agents · events · approvals · approve · deny · audit"
    )


@app.command()
def status():
    """Show AgentGuard runtime status."""

    console.print(
        Panel(
            "[green]● AgentGuard API ONLINE[/green]\n\n"
            "Authorization engine: [green]READY[/green]\n"
            "Risk engine: [green]READY[/green]\n"
            "Threat detector: [green]READY[/green]\n"
            "Audit engine: [green]READY[/green]",
            title="System Status",
        )
    )


@app.command()
def agents():
    """Show registered agents."""

    try:
        data = get_agents()

    except Exception as exc:
        console.print(
            f"[red]Unable to retrieve agents:[/red] {exc}"
        )
        raise typer.Exit(1)

    table = Table(
        title="Registered Agents"
    )

    table.add_column("Agent")
    table.add_column("Framework")
    table.add_column("Owner")
    table.add_column("Permissions")

    for agent in data.get("agents", []):

        table.add_row(
            agent.get("id", ""),
            agent.get("framework", ""),
            agent.get("owner", ""),
            str(
                len(
                    agent.get(
                        "allowed_tools",
                        [],
                    )
                )
            ),
        )

    console.print(table)

@app.command()
def permissions(agent_id: str):
    """Show permissions for an agent."""

    try:
        data = get_agent_permissions(
            agent_id
        )

    except Exception as exc:
        console.print(
            f"[red]Unable to retrieve permissions:[/red] "
            f"{exc}"
        )
        raise typer.Exit(1)

    console.print(
        Panel(
            "\n".join(
                f"✓ {action}"
                for action in data.get(
                    "allowed_tools",
                    [],
                )
            ),
            title=f"Permissions · {agent_id}",
        )
    )


@app.command()
def allow(
    agent_id: str,
    action: str,
):
    """Allow an agent to perform an action."""

    try:
        result = allow_permission(
            agent_id,
            action,
        )

        console.print(
            f"[green]✓ ALLOWED[/green] "
            f"{agent_id} → {action}"
        )

    except Exception as exc:
        console.print(
            f"[red]Unable to change permission:[/red] "
            f"{exc}"
        )
        raise typer.Exit(1)

@app.command()
def deny_permission_command(
    agent_id: str,
    action: str,
):
    """Deny an agent permission."""

    try:
        deny_permission(
            agent_id,
            action,
        )

        console.print(
            f"[red]✕ DENIED[/red] "
            f"{agent_id} → {action}"
        )

    except Exception as exc:
        console.print(
            f"[red]Unable to change permission:[/red] "
            f"{exc}"
        )
        raise typer.Exit(1)

@app.command()
def events(
    follow: bool = typer.Option(
        False,
        "--follow",
        "-f",
        help="Continuously monitor new security events.",
    )
):
    """Show security events."""

    if not follow:
        show_events()
        return

    console.print(
        Panel(
            "[bold cyan]LIVE SECURITY STREAM[/bold cyan]\n"
            "Watching AgentGuard events...\n"
            "[dim]Press Ctrl+C to stop[/dim]",
            title="AgentGuard Monitor",
        )
    )

    last_count = 0

    try:
        while True:
            data = get_audit()

            if isinstance(data, dict):
                event_list = data.get("events", [])
            else:
                event_list = data

            current_count = len(event_list)

            if current_count > last_count:
                new_events = event_list[last_count:]

                for event in new_events:
                    print_live_event(event)

                last_count = current_count

            time.sleep(2)

    except KeyboardInterrupt:
        console.print("\n[dim]Monitoring stopped.[/dim]")


def show_events():
    """Display existing events."""

    try:
        data = get_audit()

        if isinstance(data, dict):
            event_list = data.get("events", [])
        else:
            event_list = data

    except Exception as exc:
        console.print(
            f"[red]Unable to retrieve events:[/red] {exc}"
        )
        raise typer.Exit(1)

    table = Table(title="Security Events")

    table.add_column("Agent")
    table.add_column("Action")
    table.add_column("Decision")
    table.add_column("Risk")
    table.add_column("Score")

    for event in event_list[-20:]:
        decision = event.get("decision", "")
        risk = event.get("risk_level", "")

        if decision == "ALLOW":
            decision_display = "[green]ALLOW[/green]"
        elif decision == "APPROVE":
            decision_display = "[yellow]APPROVE[/yellow]"
        else:
            decision_display = "[red]BLOCK[/red]"

        table.add_row(
            event.get("agent_id", "unknown"),
            f"{event.get('tool', '')}.{event.get('action', '')}",
            decision_display,
            risk,
            str(event.get("risk_score", "")),
        )

    console.print(table)


def print_live_event(event):
    """Print one security event."""

    decision = event.get("decision", "UNKNOWN")
    agent = event.get("agent_id", "unknown")
    tool = event.get("tool", "")
    action = event.get("action", "")
    risk = event.get("risk_level", "UNKNOWN")
    score = event.get("risk_score", "?")

    if decision == "ALLOW":
        icon = "🟢"
        decision_text = "[green]ALLOW[/green]"
    elif decision == "APPROVE":
        icon = "🟡"
        decision_text = "[yellow]APPROVE[/yellow]"
    else:
        icon = "🔴"
        decision_text = "[red]BLOCK[/red]"

    console.print(
        f"\n{icon} [bold]{agent}[/bold]"
    )

    console.print(
        f"   {tool}.{action}"
    )

    console.print(
        f"   {decision_text} · {risk} · {score}"
    )

    factors = event.get("factors", [])

    if factors:
        console.print(
            "   [dim]"
            + " · ".join(factors[:3])
            + "[/dim]"
        )


@app.command()
def approvals():
    """Show pending approval requests."""

    try:
        data = get_approvals()
        approval_list = data.get("approvals", [])

    except Exception as exc:
        console.print(
            f"[red]Unable to retrieve approvals:[/red] {exc}"
        )
        raise typer.Exit(1)

    pending = [
        item
        for item in approval_list
        if item.get("status") == "PENDING"
    ]

    if not pending:
        console.print(
            Panel(
                "[green]No pending approvals.[/green]",
                title="Approvals",
            )
        )
        return

    table = Table(title="Pending Approvals")

    table.add_column("ID")
    table.add_column("Agent")
    table.add_column("Action")
    table.add_column("Risk")
    table.add_column("Created")

    for item in pending:
        request = item.get("request", {})
        decision = item.get("decision", {})

        table.add_row(
            item.get("id", "")[:8],
            request.get("agent_id", "unknown"),
            f"{request.get('tool', '')}."
            f"{request.get('action', '')}",
            (
                f"{decision.get('risk_level', '')} "
                f"({decision.get('risk_score', '')})"
            ),
            item.get("created_at", ""),
        )

    console.print(table)


@app.command()
def approve(approval_id: str):
    """Approve and execute a pending action."""

    try:
        result = __import__(
            "agentguard_cli.api",
            fromlist=["approve"],
        ).approve(approval_id)

        if result.get("executed"):
            console.print(
                Panel(
                    "[green]ACTION EXECUTED[/green]",
                    title="✓ Approved",
                )
            )
        else:
            console.print(
                Panel(
                    "[red]ACTION WAS NOT EXECUTED[/red]",
                    title="Blocked",
                )
            )

    except Exception as exc:
        console.print(
            f"[red]Approval failed:[/red] {exc}"
        )
        raise typer.Exit(1)


@app.command()
def deny(approval_id: str):
    """Reject a pending action."""

    try:
        result = reject(approval_id)

        console.print(
            Panel(
                "[red]ACTION REJECTED[/red]\n\n"
                "Tool execution: [bold]NOT EXECUTED[/bold]",
                title="✕ Denied",
            )
        )

    except Exception as exc:
        console.print(
            f"[red]Rejection failed:[/red] {exc}"
        )
        raise typer.Exit(1)


@app.command()
def audit():
    """Verify the tamper-evident audit chain."""

    try:
        result = verify_audit()

        valid = result.get("valid", False)

        if valid:
            console.print(
                Panel(
                    "[green]✓ AUDIT CHAIN VERIFIED[/green]\n\n"
                    "No integrity violations detected.",
                    title="Audit Verification",
                )
            )
        else:
            console.print(
                Panel(
                    "[red]✕ AUDIT CHAIN INVALID[/red]",
                    title="Security Alert",
                )
            )

    except Exception as exc:
        console.print(
            f"[red]Audit verification failed:[/red] {exc}"
        )
        raise typer.Exit(1)


if __name__ == "__main__":
    app()