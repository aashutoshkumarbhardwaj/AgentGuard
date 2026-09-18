.PHONY: install test backend tui mcp-test docker-up docker-down demo

install:
	cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
	pip install -e "sdk/python/[dev,langchain,crewai]"

test:
	cd backend && source .venv/bin/activate && pytest test_cedar.py test_mcp_client.py
	cd sdk/python && pytest

backend:
	cd backend && source .venv/bin/activate && uvicorn app.main:app --port 8000

tui:
	cd backend && source .venv/bin/activate && agentguard

mcp-test:
	cd backend && source .venv/bin/activate && python test_mcp_client.py

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

demo:
	./scripts/demo.sh
