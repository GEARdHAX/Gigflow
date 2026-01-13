const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  placeBid,      
  getBidsForGig, 
  getMyBids,     
  hireFreelancer 
} = require('../controllers/bidController');
router.get('/my-bids', protect, getMyBids);
router.get('/:gigId', protect, getBidsForGig);
router.post('/:gigId', protect, placeBid);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;