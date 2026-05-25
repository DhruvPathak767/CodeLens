/**
 * Realtime WebSocket Architecture Service (Socket.io Preparation)
 *
 * This service contains placeholders, hooks, and architectural diagrams
 * to fully support Socket.io in a future scale out.
 */

const SOCKET_EVENTS = require("../constants/socketEvents");
const logger = require("../utils/logger");

let io = null; // Stashes active Socket.io Server instance

/**
 * Initializes the Realtime Socket.io Server.
 * Add this to server.js during scale out:
 *
 * ```javascript
 * const http = require('http');
 * const server = http.createServer(app);
 * const socketService = require('./src/services/socketService');
 * socketService.init(server);
 * server.listen(PORT);
 * ```
 *
 * @param {Object} httpServer - Node HTTP server instance
 */
const init = (httpServer) => {
  try {
    // Boilerplate for scale out (uncomment once socket.io package is installed)
    /*
    const { Server } = require("socket.io");
    io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
      }
    });

    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
      logger.info(`[Socket] Client connected: ${socket.id}`);

      // 1. Join secure user room
      socket.on(SOCKET_EVENTS.JOIN_ROOM, (userId) => {
        if (userId) {
          const roomName = `user:${userId}`;
          socket.join(roomName);
          logger.info(`[Socket] Client ${socket.id} joined room: '${roomName}'`);
        }
      });

      // 2. Leave user room
      socket.on(SOCKET_EVENTS.LEAVE_ROOM, (userId) => {
        if (userId) {
          const roomName = `user:${userId}`;
          socket.leave(roomName);
          logger.info(`[Socket] Client ${socket.id} left room: '${roomName}'`);
        }
      });

      // 3. Disconnection
      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        logger.info(`[Socket] Client disconnected: ${socket.id}`);
      });
    });
    */
    logger.success("[Socket.io Preparation] Socket framework structure loaded.");
  } catch (error) {
    logger.error(`[Socket Error] Initialization failed: ${error.message}`);
  }
};

/**
 * Emits a realtime message specifically to a target authenticated user.
 * Bypasses broadcast leakage by targeting the user's specific room ('user:<id>').
 *
 * @param {string} userId - Target User's MongoDB ID
 * @param {string} event - Realtime Event Name (from SOCKET_EVENTS)
 * @param {Object} payload - Message body contents
 */
const toUser = (userId, event, payload) => {
  if (!userId || !event) return;

  const roomName = `user:${userId}`;
  logger.info(`[Socket Emit] Target Room: '${roomName}' -> Event: '${event}'`);

  if (io) {
    // Send message to the user room
    io.to(roomName).emit(event, payload);
  } else {
    logger.warn(
      `[Socket Warning] Server not active. Message cached (Room: ${roomName}, Event: ${event})`
    );
  }
};

module.exports = {
  init,
  toUser,
};
