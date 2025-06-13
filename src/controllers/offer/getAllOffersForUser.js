import Offer from '../../models/offerModel.js';

export const getAllOffersForUser = async (req, res) => {
  try {
    const now = new Date();
    const offer = await Offer.find({
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now },
    });
    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
