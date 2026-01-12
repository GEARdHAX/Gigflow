const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// --- 1. CONNECT DB ---
connectDB();

// --- 2. TRUST PROXY (REQUIRED FOR RENDER COOKIES) ---
app.set('trust proxy', 1); // <--- ADD THIS LINE HERE

// --- 3. MIDDLEWARE ---
app.use(cors({
  origin: process.env.CLIENT_URL, // Ensure this is https://gigflow-five.vercel.app
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- 4. ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));