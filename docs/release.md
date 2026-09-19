# Release Process

This document outlines the exact steps to publish a new version of AgentGuard. Do not automate PyPI publishing in CI; this should remain a manual operation performed by an authorized maintainer.

## Prerequisites
- A clean Git working directory.
- Passing CI on the `main` branch.
- An authorized PyPI account with access to the `agentguard-sdk` project.

## 1. Version Bump & Consistency Check
Ensure the new version number (e.g., `1.0.0`) is consistent across the repository.
- `sdk/python/pyproject.toml`
- `backend/pyproject.toml`
- `backend/cli/pyproject.toml`
- `backend/app/main.py` (FastAPI title/version)

## 2. Local Testing Verification
Run the full test suite locally before tagging.
```bash
# Backend
cd backend && pytest
PYTHONPATH=. pytest tests/test_security_regression.py -v

# SDK
cd sdk/python && pytest
```

## 3. Package Build
Build the SDK wheels and source distribution.
```bash
cd sdk/python
python -m build
```
Verify the contents of the `dist/` directory.

## 4. Changelog Update
Update `CHANGELOG.md` with the new version, date, and a summary of the changes (Features, Fixes, Breaking Changes).

## 5. Git Tag & GitHub Release
Commit the version bumps and push to `main`.
```bash
git add .
git commit -m "chore: release v1.0.0"
git tag v1.0.0
git push origin main --tags
```
Go to GitHub and draft a new release from the `v1.0.0` tag. Copy the contents of the `CHANGELOG.md` entry into the release notes.

## 6. PyPI Publishing
Publish the package to PyPI using `twine`.
```bash
cd sdk/python
python -m twine upload dist/*
```
Ensure that no errors occur during the upload.

## 7. Post-Release Verification
In a fresh temporary directory, verify the installation.
```bash
cd /tmp
python -m venv venv
source venv/bin/activate
pip install agentguard-sdk
python -c "import agentguard; print(agentguard.__version__)"
```
