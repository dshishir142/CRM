const agentSockets = new Map();

function registerAgent(agent_id, ws) {
  agentSockets.set(agent_id, ws);
}

function unregisterAgent(ws) {
  for (const [agent_id, socket] of agentSockets.entries()) {
    if (socket === ws) {
      agentSockets.delete(agent_id);
      break;
    }
  }
}

function getWebSocketForAgent(agent_id) {
  return agentSockets.get(agent_id);
}

module.exports = { registerAgent, unregisterAgent, getWebSocketForAgent };
