import time

from textual.app import App, ComposeResult
from textual.containers import Horizontal, Vertical
from textual.widgets import Header, Footer, Static
from textual.reactive import reactive

from .api import (
    get_audit,
    get_approvals,
    approve,
    reject,
)


class AgentGuardApp(App):
    """AgentGuard Runtime Security Control Plane."""

    CSS = """
    Screen {
        background: #050505;
        color: #eeeeee;
    }

    Header {
        background: #090909;
        color: #d97757;
    }

    Footer {
        background: #090909;
    }

    #sidebar {
        width: 25;
        border-right: solid #333333;
        padding: 1 2;
    }

    #main {
        width: 1fr;
        padding: 1 2;
    }

    #brand {
        height: 5;
        content-align: center middle;
        color: #d97757;
        text-style: bold;
    }

    #status {
        height: 3;
        border: round #d97757;
        content-align: center middle;
        color: #79d99a;
    }

    .section-title {
        color: #d97757;
        text-style: bold;
        margin-top: 1;
        margin-bottom: 1;
    }

    .nav {
        height: 3;
        padding: 1;
    }

    .nav:hover {
        background: #191919;
    }

    #stats {
        height: 8;
    }

    .stat {
        width: 1fr;
        border: round #333333;
        margin-right: 1;
        padding: 1;
        content-align: center middle;
    }

    #events {
        height: 1fr;
        min-height: 12;
        border: round #333333;
        padding: 1;
        overflow-y: auto;
    }

    .event {
        height: 3;
        padding: 0 1;
    }

    #approval {
        height: 10;
        border: round #d97757;
        padding: 1;
    }

    #footer-info {
        height: 2;
        content-align: center middle;
        color: #777777;
    }

    .green {
        color: #79d99a;
    }

    .yellow {
        color: #e7c66a;
    }

    .red {
        color: #e87575;
    }
    """

    BINDINGS = [
        ("q", "quit", "Quit"),
        ("a", "approve", "Approve"),
        ("d", "deny", "Deny"),
        ("r", "refresh", "Refresh"),
    ]

    event_count = reactive(0)
    blocked_count = reactive(0)
    pending_count = reactive(0)
    threat_count = reactive(0)

    current_approval_id = None

    def compose(self) -> ComposeResult:

        yield Header(show_clock=True)

        with Horizontal():

            # ─────────────────────────────
            # SIDEBAR
            # ─────────────────────────────

            with Vertical(id="sidebar"):

                yield Static(
                    "A G E N T\nG U A R D",
                    id="brand",
                )

                yield Static(
                    "● PROTECTED",
                    id="status",
                )

                yield Static(
                    "OVERVIEW",
                    classes="section-title",
                )

                yield Static("◉ Dashboard", classes="nav")
                yield Static("◉ Agents", classes="nav")
                yield Static("◉ Approvals", classes="nav")
                yield Static("◉ Events", classes="nav")
                yield Static("◉ Policies", classes="nav")
                yield Static("◉ Audit", classes="nav")

                yield Static(
                    "SECURITY",
                    classes="section-title",
                )

                yield Static(
                    "◉ Attack Simulator",
                    classes="nav",
                )

            # ─────────────────────────────
            # MAIN
            # ─────────────────────────────

            with Vertical(id="main"):

                yield Static(
                    "SECURITY OVERVIEW",
                    classes="section-title",
                )

                with Horizontal(id="stats"):

                    yield Static(
                        "ACTIONS\n\n[bold]0[/bold]",
                        id="stat-actions",
                        classes="stat",
                    )

                    yield Static(
                        "BLOCKED\n\n[bold]0[/bold]",
                        id="stat-blocked",
                        classes="stat",
                    )

                    yield Static(
                        "PENDING\n\n[bold]0[/bold]",
                        id="stat-pending",
                        classes="stat",
                    )

                    yield Static(
                        "THREATS\n\n[bold]0[/bold]",
                        id="stat-threats",
                        classes="stat",
                    )

                yield Static(
                    "LIVE SECURITY EVENTS",
                    classes="section-title",
                )

                yield Vertical(id="events")

                yield Static(
                    "PENDING APPROVAL",
                    classes="section-title",
                )

                yield Static(
                    "Loading...",
                    id="approval",
                )

                yield Static(
                    "↑↓ Navigate   "
                    "A Approve   "
                    "D Deny   "
                    "R Refresh   "
                    "Q Quit",
                    id="footer-info",
                )

        yield Footer()

    def on_mount(self):

        self.refresh_data()

        # Refresh backend every 2 seconds.
        self.set_interval(
            2,
            self.refresh_data,
        )

    def refresh_data(self):

        try:
            audit_data = get_audit()

            if isinstance(audit_data, dict):
                events = audit_data.get("events", [])
            else:
                events = audit_data or []

            approvals_data = get_approvals()

            if isinstance(approvals_data, dict):
                approvals = approvals_data.get(
                    "approvals",
                    [],
                )
            else:
                approvals = approvals_data or []

            pending = [
                item
                for item in approvals
                if item.get("status") == "PENDING"
            ]

            blocked = [
                event
                for event in events
                if event.get("decision") == "BLOCK"
            ]

            threats = [
                event
                for event in events
                if "threat" in str(
                    event.get("reason", "")
                ).lower()
                or "injection" in str(
                    event.get("factors", "")
                ).lower()
            ]

            self.event_count = len(events)
            self.blocked_count = len(blocked)
            self.pending_count = len(pending)
            self.threat_count = len(threats)

            self.update_stats()
            self.update_events(events)
            self.update_approval(pending)

        except Exception as exc:

            self.query_one("#status").update(
                "● API CONNECTION ERROR"
            )

            self.query_one("#status").add_class(
                "red"
            )

    def update_stats(self):

        self.query_one(
            "#stat-actions"
        ).update(
            f"ACTIONS\n\n[bold]{self.event_count}[/bold]"
        )

        self.query_one(
            "#stat-blocked"
        ).update(
            f"BLOCKED\n\n[bold]{self.blocked_count}[/bold]"
        )

        self.query_one(
            "#stat-pending"
        ).update(
            f"PENDING\n\n[bold]{self.pending_count}[/bold]"
        )

        self.query_one(
            "#stat-threats"
        ).update(
            f"THREATS\n\n[bold]{self.threat_count}[/bold]"
        )

    def update_events(self, events):

        container = self.query_one("#events")

        container.remove_children()

        recent_events = events[-20:]

        for event in reversed(recent_events):

            decision = event.get(
                "decision",
                "UNKNOWN",
            )

            agent = event.get(
                "agent_id",
                "unknown-agent",
            )

            tool = event.get(
                "tool",
                "",
            )

            action = event.get(
                "action",
                "",
            )

            score = event.get(
                "risk_score",
                "?",
            )

            risk = event.get(
                "risk_level",
                "UNKNOWN",
            )

            if decision == "ALLOW":

                icon = "🟢"
                style = "green"

            elif decision == "APPROVE":

                icon = "🟡"
                style = "yellow"

            else:

                icon = "🔴"
                style = "red"

            text = (
                f"{icon} "
                f"[bold]{agent}[/bold]   "
                f"{tool}.{action}   "
                f"[{style}]{decision}[/{style}]"
                f" · {risk} · {score}"
            )

            container.mount(
                Static(
                    text,
                    classes="event",
                )
            )

    def update_approval(self, pending):

        widget = self.query_one(
            "#approval"
        )

        if not pending:

            self.current_approval_id = None

            widget.update(
                "[green]No pending approvals.[/green]"
            )

            return

        approval = pending[0]

        self.current_approval_id = approval.get(
            "id"
        )

        request = approval.get(
            "request",
            {},
        )

        decision = approval.get(
            "decision",
            {},
        )

        agent = request.get(
            "agent_id",
            "unknown",
        )

        tool = request.get(
            "tool",
            "",
        )

        action = request.get(
            "action",
            "",
        )

        risk = decision.get(
            "risk_level",
            "UNKNOWN",
        )

        score = decision.get(
            "risk_score",
            "?",
        )

        widget.update(
            f"[bold]{agent}[/bold] → "
            f"{tool}.{action}\n\n"
            f"Risk: [yellow]{risk} · {score}[/yellow]\n\n"
            "[bold]A[/bold] Approve    "
            "[bold]D[/bold] Deny"
        )

    def action_approve(self):

        if not self.current_approval_id:

            self.notify(
                "No pending approval.",
                severity="warning",
            )

            return

        approval_id = self.current_approval_id

        try:

            result = approve(
                approval_id
            )

            if result.get("executed"):

                self.notify(
                    "Action approved and executed.",
                    title="✓ AgentGuard",
                )

            else:

                self.notify(
                    "Security re-check blocked execution.",
                    title="⚠ AgentGuard",
                    severity="error",
                )

            self.refresh_data()

        except Exception as exc:

            self.notify(
                f"Approval failed: {exc}",
                severity="error",
            )

    def action_deny(self):

        if not self.current_approval_id:

            self.notify(
                "No pending approval.",
                severity="warning",
            )

            return

        approval_id = self.current_approval_id

        try:

            reject(
                approval_id
            )

            self.notify(
                "Action rejected. Tool was not executed.",
                title="✕ AgentGuard",
            )

            self.refresh_data()

        except Exception as exc:

            self.notify(
                f"Rejection failed: {exc}",
                severity="error",
            )

    def action_refresh(self):

        self.refresh_data()

        self.notify(
            "Security state refreshed.",
            title="AgentGuard",
        )


def run_tui():

    AgentGuardApp().run()