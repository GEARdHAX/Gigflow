const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const socketUtil = require('../utils/socket'); // For Real-time Bonus
const { calculateATSScore } = require('../utils/atsService'); // Import the utility


exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title status') // Get Gig title and status
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    
    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig not available' });
    }

    // Prevent owner from bidding on own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot bid on your own gig' });
    }
    const existingBid = await Bid.findOne({ 
      gigId: gigId, 
      freelancerId: req.user._id 
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this gig.' });
    }
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bids for a specific gig (Owner only)
// @route   GET /api/bids/:gigId
exports.getBidsByGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    
    // Security check: Only the owner sees bids [cite: 30]
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession(); // Start Transaction [cite: 37]
  session.startTransaction();

  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId).session(session);

    // Authorization Check
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized' });
    }

    // RACE CONDITION CHECK [cite: 38]
    // If another admin hired someone else 1ms ago, this will be 'assigned'
    // and this transaction will fail here.
    if (gig.status === 'assigned') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Gig already assigned to someone else!' });
    }

    // 1. Update Gig Status
    gig.status = 'assigned';
    await gig.save({ session });

    // 2. Update Chosen Bid Status
    bid.status = 'hired';
    await bid.save({ session });

    // 3. Reject all OTHER bids for this gig
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: 'rejected' }
    ).session(session);

    // Commit Transaction (Atomic Update)
    await session.commitTransaction();
    session.endSession();

    // BONUS 2: Real-time Notification [cite: 40]
    const io = socketUtil.getIO();
    // Emit to the specific freelancer's room
    io.to(bid.freelancerId.toString()).emit('notification:hired', {
      message: `You have been hired for ${gig.title}!`,
      gigId: gig._id
    });

    res.json({ message: 'Freelancer hired successfully' });

  } catch (error) {
    // If anything fails, rollback everything
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

exports.getBidsByGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Check ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    // --- FIX STARTS HERE ---
    const bidsWithScores = bids.map(bid => {
      // 1. Convert Mongoose Document to Plain JS Object
      const bidObj = bid.toObject(); 

      // 2. Calculate Score
      const score = calculateATSScore(gig.description, bid.message);

      // 3. Attach Score to the plain object
      bidObj.atsScore = score;

      return bidObj;
    });

    // 4. Sort by Score (Highest first)
    bidsWithScores.sort((a, b) => b.atsScore - a.atsScore);
    // --- FIX ENDS HERE ---

    res.json(bidsWithScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};