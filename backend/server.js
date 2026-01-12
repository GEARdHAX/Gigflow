require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const socketUtil = require('./utils/socket');
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL, // e.g., 'https://gigflow-five.vercel.app'
  credentials: true, // This allows the cookie to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Initialize Socket.io
const io = socketUtil.init(server);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join a room based on User ID for private notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));