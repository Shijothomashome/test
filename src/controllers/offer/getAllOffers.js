import Offer from '../../models/offerModel.js';

const getAllOffers = async (req, res) => {
  try {
    const { isActive, valid } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (valid === 'true') {
      const now = new Date();
      query.validFrom = { $lte: now };
      query.validTill = { $gte: now };
    }

    const offers = await Offer.find(query);
    res.status(200).json({
      success: true,
      message: 'Offers fetched successfully',
      data: offers
    });
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};

export default getAllOffers;
