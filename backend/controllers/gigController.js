const Gig = require('../models/Gig');
const Bid = require('../models/Bid');
// @desc    Create a new job post
// @route   POST /api/gigs
// Add this new function
exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id, // From auth middleware
    });
    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch all open gigs (with search)
// @route   GET /api/gigs
exports.getGigs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'open' }; // Only show open jobs [cite: 18]

    if (search) {
      // Regex for partial match, case insensitive [cite: 19]
      query.title = { $regex: search, $options: 'i' };
    }

    const gigs = await Gig.find(query).populate('ownerId', 'name email').sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a Gig
// @route   PUT /api/gigs/:id
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Authorization: Ensure only the owner can update
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this gig' });
    }

    // Update fields
    gig.title = req.body.title || gig.title;
    gig.description = req.body.description || gig.description;
    gig.budget = req.body.budget || gig.budget;

    const updatedGig = await gig.save();
    res.json(updatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a Gig
// @route   DELETE /api/gigs/:id
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Authorization: Ensure only the owner can delete
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this gig' });
    }

    // CLEANUP: Delete all bids associated with this gig first
    await Bid.deleteMany({ gigId: gig._id });

    // Delete the gig
    await gig.deleteOne();

    res.json({ message: 'Gig removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};