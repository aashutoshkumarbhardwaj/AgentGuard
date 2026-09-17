from typing import Dict, List, Optional

# In-memory agent store (in production, use a database)
AGENTS: Dict[str, Dict] = {
    "research-agent": {
        "name": "Research Agent",
        "description": "Agent for researching information",
        "allowed_tools": ["read_calendar", "send_internal_email", "read_files"],
        "risk_level": "LOW",
        "max_risk_score": 50
    },
    "assistant-agent": {
        "name": "Assistant Agent", 
        "description": "General purpose assistant",
        "allowed_tools": ["read_calendar", "send_internal_email"],
        "risk_level": "LOW",
        "max_risk_score": 30
    },
    "external-agent": {
        "name": "External Agent",
        "description": "Agent with external communication capabilities",
        "allowed_tools": ["send_external_email", "read_files", "delete_files"],
        "risk_level": "HIGH",
        "max_risk_score": 90
    }
}


def get_agent(agent_id: str) -> Optional[Dict]:
    """Get agent by ID."""
    return AGENTS.get(agent_id)


def create_agent(agent_id: str, agent_data: Dict) -> Dict:
    """Create a new agent."""
    AGENTS[agent_id] = agent_data
    return agent_data


def update_agent(agent_id: str, agent_data: Dict) -> Optional[Dict]:
    """Update an existing agent."""
    if agent_id in AGENTS:
        AGENTS[agent_id].update(agent_data)
        return AGENTS[agent_id]
    return None


def delete_agent(agent_id: str) -> bool:
    """Delete an agent."""
    if agent_id in AGENTS:
        del AGENTS[agent_id]
        return True
    return False


def can_use_tool(agent_id: str, tool_name: str) -> bool:
    """Check if an agent can use a specific tool."""
    agent = get_agent(agent_id)
    if not agent:
        return False
    return tool_name in agent.get("allowed_tools", [])


def get_registered_agents() -> List[Dict]:
    """Get all registered agents with their IDs."""
    return [
        {"id": agent_id, **agent_data}
        for agent_id, agent_data in AGENTS.items()
    ]


def get_agent_details(agent_id: str) -> Optional[Dict]:
    """Get detailed agent information."""
    agent = get_agent(agent_id)
    if agent:
        return {"id": agent_id, **agent}
    return None