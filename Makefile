.PHONY: install test backend tui mcp-test docker-up docker-down demo dev frontend

install:
	cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
	pip install -e "sdk/python/[dev,langchain,crewai]"
	cd frontend && npm install

dev:
	npm --prefix frontend run dev

frontend:
	npm --prefix frontend run dev

frontend-build:
	npm --prefix frontend run build

test:
	cd backend && source .venv/bin/activate && pytest tests
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

