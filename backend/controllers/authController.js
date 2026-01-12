const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- HELPER: GENERATE TOKEN & SET COOKIE ---
const sendToken = (user, statusCode, res) => {
  // 1. Create the token
  // We sign it here to ensure it works even if your User model doesn't have the method
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  // 2. Define Cookie Options (CRITICAL FOR RENDER/VERCEL)
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevent XSS
    secure: true,   // ALWAYS true for cross-site (Render requires this)
    sameSite: 'none' // ALWAYS 'none' to allow cross-site cookies
  };

  // 3. Send Response
  // Note: Cookie name must be 'jwt' to match your authMiddleware
  res.status(statusCode)
    .cookie('jwt', token, options) 
    .json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token // Sending token in body as backup
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      // Use the helper to set cookie and send response
      sendToken(user, 201, res);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Use the helper to set cookie and send response
      sendToken(user, 200, res);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logoutUser = (req, res) => {
  // To delete a cross-site cookie, options must match creation
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'none'
  });
  
  res.status(200).json({ message: 'Logged out' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    // The 'protect' middleware already attached user to req.user
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};