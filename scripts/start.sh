#!/bin/bash
set -e

echo "=> Checking for Docker..."
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH."
    exit 1
fi

echo "=> Starting AgentGuard in Docker Compose..."
docker compose up -d --build

echo "=> Waiting for AgentGuard API to become healthy..."
until curl -s http://localhost:8000/health | grep -q '"status":"healthy"'; do
    sleep 2
    echo "   still waiting..."
done

echo ""
echo "==============================================="
echo "   AgentGuard Services Running Successfully!   "
echo "==============================================="
echo ""
echo "API Endpoint : http://localhost:8000"
echo "Health Status: http://localhost:8000/health"
echo "MCP Gateway  : Attached to docker container 'mcp-gateway'"
echo ""
echo "=> To launch the Textual TUI locally:"
echo "   cd backend"
echo "   source .venv/bin/activate"
echo "   agentguard"
echo ""
