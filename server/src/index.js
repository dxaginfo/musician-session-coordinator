require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { setupDb } = require('./db/db-setup');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const sessionRoutes = require('./routes/sessions');
const paymentRoutes = require('./routes/payments');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');

// Initialize database
setupDb();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/sessions', authMiddleware, sessionRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/reviews', authMiddleware, reviewRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

// Socket.io setup
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  
  // Join a room (user's ID)
  socket.on('join', (userId) => {
    socket.join(userId);
    logger.info(`User ${userId} joined their room`);
  });
  
  // Handle private messages
  socket.on('private-message', ({ to, message, from }) => {
    io.to(to).emit('private-message', {
      from,
      message,
      time: new Date()
    });
  });
  
  // Handle typing indicators
  socket.on('typing', ({ to, from }) => {
    io.to(to).emit('typing', { from });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server }; // Export for testing