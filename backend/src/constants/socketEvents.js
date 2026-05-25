/**
 * Centralized Realtime WebSocket Event Names
 */
const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  
  // Review Status Pipeline
  REVIEW_STATUS_UPDATE: "review_status_update", // Emitted during background work stages
  
  // SaaS events
  NOTIFICATION_RECEIVED: "notification_received", // Emitted on completed review or critical alerts
};

module.exports = SOCKET_EVENTS;
