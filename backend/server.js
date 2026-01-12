const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// 1. Connect to Database
connectDB();

// --- CRITICAL MIDDLEWARE ORDER ---

// A. CORS (Must be first to allow the request in)
app.use(cors({
  origin: process.env.CLIENT_URL, // https://gigflow-five.vercel.app
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// B. JSON PARSER (Fixes 'req.body is undefined')
app.use(express.json());  // <--- MAKE SURE THIS IS HERE AND BEFORE ROUTES

// C. URL ENCODED (Optional, but good for form submissions)
app.use(express.urlencoded({ extended: false }));

// D. COOKIE PARSER (Fixes 'req.cookies is undefined')
app.use(cookieParser());

// --- ROUTES (Must be AFTER middleware) ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));