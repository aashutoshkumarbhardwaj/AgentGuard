import sqlite3
from pathlib import Path


import os

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "agentguard.db"


def get_db_path() -> str:
    return os.environ.get("AGENTGUARD_DB", str(DEFAULT_DB_PATH))


def get_connection():
    db_path = get_db_path()
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():

    conn = get_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS agents (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            framework TEXT NOT NULL,
            owner TEXT NOT NULL
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS agent_permissions (
            agent_id TEXT NOT NULL,
            action TEXT NOT NULL,
            PRIMARY KEY (agent_id, action),
            FOREIGN KEY (agent_id)
                REFERENCES agents(id)
                ON DELETE CASCADE
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS system_config (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def get_config_val(key: str, default: str | None = None) -> str | None:
    try:
        conn = get_connection()
        row = conn.execute("SELECT value FROM system_config WHERE key = ?", (key,)).fetchone()
        conn.close()
        if row and row["value"]:
            return row["value"]
        return default
    except Exception:
        return default


def set_config_val(key: str, value: str):
    conn = get_connection()
    conn.execute("""
        INSERT INTO system_config (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at
    """, (key, value))
    conn.commit()
    conn.close()


def delete_config_val(key: str):
    try:
        conn = get_connection()
        conn.execute("DELETE FROM system_config WHERE key = ?", (key,))
        conn.commit()
        conn.close()
    except Exception:
        pass


def seed_agents():

    conn = get_connection()

    agents = [
        (
            "research-agent",
            "Research Agent",
            "custom",
            "user-001",
        ),
        (
            "support-agent",
            "Support Agent",
            "custom",
            "user-001",
        ),
    ]

    for agent in agents:

        conn.execute(
            """
            INSERT OR IGNORE INTO agents
            (id, name, framework, owner)
            VALUES (?, ?, ?, ?)
            """,
            agent,
        )

    permissions = {
        "research-agent": [
            "calendar.read",
            "email.read",
            "file.read",
            "email.send",
            "file.modify",
        ],
        "support-agent": [
            "calendar.read",
            "email.read",
            "email.send",
        ],
    }

    for agent_id, actions in permissions.items():

        for action in actions:

            conn.execute(
                """
                INSERT OR IGNORE INTO agent_permissions
                (agent_id, action)
                VALUES (?, ?)
                """,
                (agent_id, action),
            )

    conn.commit()
    conn.close()


def list_agents():

    conn = get_connection()

    rows = conn.execute(
        """
        SELECT * FROM agents
        """
    ).fetchall()

    result = []

    for row in rows:

        permissions = conn.execute(
            """
            SELECT action
            FROM agent_permissions
            WHERE agent_id = ?
            ORDER BY action
            """,
            (row["id"],),
        ).fetchall()

        result.append({
            "id": row["id"],
            "name": row["name"],
            "framework": row["framework"],
            "owner": row["owner"],
            "allowed_tools": [
                permission["action"]
                for permission in permissions
            ],
        })

    conn.close()

    return result


def get_agent(agent_id):

    conn = get_connection()

    agent = conn.execute(
        """
        SELECT * FROM agents
        WHERE id = ?
        """,
        (agent_id,),
    ).fetchone()

    if not agent:
        conn.close()
        return None

    permissions = conn.execute(
        """
        SELECT action
        FROM agent_permissions
        WHERE agent_id = ?
        ORDER BY action
        """,
        (agent_id,),
    ).fetchall()

    result = {
        "id": agent["id"],
        "name": agent["name"],
        "framework": agent["framework"],
        "owner": agent["owner"],
        "allowed_tools": [
            row["action"]
            for row in permissions
        ],
    }

    conn.close()

    return result


def allow_permission(agent_id, action):

    conn = get_connection()

    conn.execute(
        """
        INSERT OR IGNORE INTO agent_permissions
        (agent_id, action)
        VALUES (?, ?)
        """,
        (agent_id, action),
    )

    conn.commit()
    conn.close()

    return get_agent(agent_id)


def deny_permission(agent_id, action):

    conn = get_connection()

    conn.execute(
        """
        DELETE FROM agent_permissions
        WHERE agent_id = ?
        AND action = ?
        """,
        (agent_id, action),
    )

    conn.commit()
    conn.close()

    return get_agent(agent_id)


def can_use_tool(agent_id, action):

    conn = get_connection()

    row = conn.execute(
        """
        SELECT 1
        FROM agent_permissions
        WHERE agent_id = ?
        AND action = ?
        """,
        (agent_id, action),
    ).fetchone()

    conn.close()

    return row is not None