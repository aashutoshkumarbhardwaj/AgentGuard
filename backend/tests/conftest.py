"""
Pytest configuration for AgentGuard backend tests.
Isolates test databases and MCP server configurations to temporary files,
ensuring tests NEVER pollute the local runtime database (agentguard.db).
"""

import sys
import os
import tempfile
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Create an isolated temporary test database so tests NEVER write to production agentguard.db
_TEST_DB_FILE = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
_TEST_CONFIG_FILE = tempfile.NamedTemporaryFile(suffix=".json", delete=False)

# Write empty servers config
Path(_TEST_CONFIG_FILE.name).write_text('{"servers": []}', encoding="utf-8")

os.environ["AGENTGUARD_DB"] = _TEST_DB_FILE.name
os.environ["MCP_CONFIG_PATH"] = _TEST_CONFIG_FILE.name

from app.db.agents import init_db, seed_agents
from app.db.audit import init_audit_db
from app.core.approvals import init_approvals_db

init_db()
seed_agents()
init_audit_db()
init_approvals_db()


@pytest.fixture(scope="session", autouse=True)
def clean_test_environment():
    """Ensures test environment uses isolated temp paths and cleans up on exit."""
    yield
    try:
        if os.path.exists(_TEST_DB_FILE.name):
            os.unlink(_TEST_DB_FILE.name)
        if os.path.exists(_TEST_CONFIG_FILE.name):
            os.unlink(_TEST_CONFIG_FILE.name)
    except Exception:
        pass
