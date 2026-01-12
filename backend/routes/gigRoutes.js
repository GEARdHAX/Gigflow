// routes/gigRoutes.js
const express = require('express');
const { 
  createGig, 
  getGigs, 
  getMyGigs, 
  updateGig, 
  deleteGig 
} = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createGig)
  .get(getGigs);

router.get('/my_gigs', protect, getMyGigs);

// NEW: ID-based operations (Update & Delete)
router.route('/:id')
  .put(protect, updateGig)
  .delete(protect, deleteGig);

module.exports = router;