import type { Decision, RiskLevel } from "./types";

export function getDecisionColor(decision: Decision): string {
  switch (decision) {
    case "ALLOW":
      return "text-success";
    case "APPROVE":
      return "text-warning";
    case "BLOCK":
      return "text-danger";
  }
}

export function getDecisionBg(decision: Decision): string {
  switch (decision) {
    case "ALLOW":
      return "bg-success/10 border-success/30";
    case "APPROVE":
      return "bg-warning/10 border-warning/30";
    case "BLOCK":
      return "bg-danger/10 border-danger/30";
  }
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "text-success";
    case "MEDIUM":
      return "text-warning";
    case "HIGH":
      return "text-warning";
    case "CRITICAL":
      return "text-danger";
  }
}

export function getRiskBg(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "bg-success/15";
    case "MEDIUM":
      return "bg-warning/15";
    case "HIGH":
      return "bg-warning/20";
    case "CRITICAL":
      return "bg-danger/20";
  }
}

export function getRiskBarColor(score: number): string {
  if (score < 40) return "bg-success";
  if (score < 70) return "bg-warning";
  if (score < 90) return "bg-warning";
  return "bg-danger";
}

export function getActionIcon(action: string): string {
  if (action.startsWith("calendar")) return "calendar";
  if (action.startsWith("email")) return "email";
  if (action.startsWith("file")) return "file";
  if (action.startsWith("credential")) return "credential";
  if (action.startsWith("data")) return "data";
  if (action.startsWith("shell")) return "shell";
  return "tool";
}

export function truncateHash(hash: string): string {
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
