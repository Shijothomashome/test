import Offer from '../../models/offerModel.js';

const getAllOffersForUser = async (req, res) => {
  try {
    const now = new Date();
    const offer = await Offer.find({
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now },
    });
    res.json({
      success: true,
      message: "offer fetched successfully",
      data:offer
    });
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    })
  }
};

export default getAllOffersForUser;