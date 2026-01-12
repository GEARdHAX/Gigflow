const express = require('express');
const { createBid, getBidsByGig, hireFreelancer, getMyBids } = require('../controllers/bidController'); // Import getMyBids
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createBid);
router.get('/my-bids', protect, getMyBids); // New Route
router.get('/:gigId', protect, getBidsByGig);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;