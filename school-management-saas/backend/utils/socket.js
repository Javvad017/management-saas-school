import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from './logger.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.schoolId = decoded.schoolId;
      next();
    } catch (error) {
      logger.error(`Socket auth error: ${error.message}`);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId} (${socket.userRole})`);

    // Join school-specific room
    if (socket.schoolId) {
      socket.join(`school_${socket.schoolId}`);
      logger.info(`User ${socket.userId} joined school room: school_${socket.schoolId}`);
    }

    // Join role-specific room
    socket.join(`role_${socket.userRole}`);

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit events to specific school
export const emitToSchool = (schoolId, event, data) => {
  if (io) {
    io.to(`school_${schoolId}`).emit(event, data);
    logger.info(`Emitted ${event} to school ${schoolId}`);
  }
};

// Emit events to specific role
export const emitToRole = (role, event, data) => {
  if (io) {
    io.to(`role_${role}`).emit(event, data);
    logger.info(`Emitted ${event} to role ${role}`);
  }
};

// Emit events to specific user
export const emitToUser = (userId, event, data) => {
  if (io) {
    const sockets = io.sockets.sockets;
    for (const [socketId, socket] of sockets) {
      if (socket.userId === userId) {
        socket.emit(event, data);
        logger.info(`Emitted ${event} to user ${userId}`);
      }
    }
  }
};
