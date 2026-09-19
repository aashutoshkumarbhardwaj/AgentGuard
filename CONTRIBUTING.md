# Contributing to AgentGuard

Thank you for your interest in contributing to AgentGuard! We welcome pull requests, bug reports, and feature requests.

## Development Setup

AgentGuard is composed of several pieces: the FastAPI backend, the Python SDK, and the CLI. We recommend using Python 3.10+.

### 1. Clone the repository
```bash
git clone https://github.com/agentguard/agentguard.git
cd agentguard
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .
```

### 3. SDK Setup
```bash
cd sdk/python
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

## Running Tests

Before submitting a PR, ensure all tests pass. 

**Backend Tests:**
```bash
cd backend
pytest
```

**SDK Tests:**
```bash
cd sdk/python
pytest
```

**Security Regression Tests (Crucial):**
```bash
cd backend
PYTHONPATH=. pytest tests/test_security_regression.py -v
```

## MCP Testing
To test the Model Context Protocol (MCP) gateway integration:
```bash
cd backend
python test_mcp_client.py
```

## Pull Request Expectations
- **Keep it small**: Targeted PRs are reviewed faster.
- **Add tests**: Any new feature or bugfix should include corresponding pytest coverage.
- **Security-Sensitive Changes**: If you are modifying the Risk Engine, Cedar policy execution, Context Engine, or Audit Hash Chain, please note this explicitly in your PR description. These require rigorous manual and automated review.

## Code Style
We use standard Python formatting. Please ensure your code is clean, readable, and properly typed where applicable.
