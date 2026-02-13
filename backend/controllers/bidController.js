const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const { calculateATSScore } = require('../utils/atsService');

// @desc    Place a new bid
// @route   POST /api/bids/:gigId
exports.placeBid = async (req, res) => {
  try {
    const { message, price } = req.body;
    const { gigId } = req.params;

    // 1. Check if Gig exists and is Open
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer accepting bids' });
    }

    // 2. Check if user already bid
    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this gig' });
    }

    // 3. Calculate ATS Score (compares gig description against bid message)
    const atsScore = calculateATSScore(gig.description, message);

    // 4. Create Bid with ATS Score
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
      atsScore
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bids for a specific gig (Client view)
// @route   GET /api/bids/gig/:gigId
exports.getBidsForGig = async (req, res) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bids by current user (Freelancer view)
// @route   GET /api/bids/my-bids
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title budget status')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Hire a freelancer (Atomic Transaction + Notification)
// @route   PUT /api/bids/hire/:bidId
exports.hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // 1. Find the Bid and Update to 'hired'
    const bid = await Bid.findByIdAndUpdate(
      bidId,
      { status: 'hired' },
      { session, new: true }
    ).populate('gigId');

    if (!bid) {
      throw new Error('Bid not found');
    }

    // 2. Verify Gig is still Open (Concurrency Check)
    if (bid.gigId.status !== 'open') {
      throw new Error('This gig is already assigned or closed');
    }

    // 3. Update Gig Status to 'assigned'
    await Gig.findByIdAndUpdate(
      bid.gigId._id,
      { status: 'assigned' },
      { session }
    );

    // 4. Reject all OTHER bids for this gig
    await Bid.updateMany(
      { gigId: bid.gigId._id, _id: { $ne: bidId } },
      { status: 'rejected' },
      { session }
    );

    // 5. COMMIT THE TRANSACTION (Database work is done)
    await session.commitTransaction();

    // --- SAFE ZONE: DATABASE IS SAVED ---
    // We end the session immediately to free up connection
    session.endSession();

    // 6. Send Real-Time Notification (Isolated from DB Transaction)
    // Even if this fails, the hiring is already saved.
    try {
      if (req.io && req.userSocketMap) {
        const freelancerId = bid.freelancerId.toString();
        const socketId = req.userSocketMap.get(freelancerId);

        if (socketId) {
          req.io.to(socketId).emit('notification', {
            message: `🎉 You have been hired for "${bid.gigId.title}"!`
          });
          console.log(`Notification sent to user ${freelancerId}`);
        } else {
          console.log(`User ${freelancerId} is offline, notification skipped.`);
        }
      }
    } catch (notifyError) {
      console.error("Socket notification error:", notifyError.message);
    }

    res.json({ success: true, message: 'Freelancer hired successfully' });

  } catch (error) {
    // 7. SAFE ABORT (Only abort if transaction is still active)
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    console.error("Hiring Transaction Failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};