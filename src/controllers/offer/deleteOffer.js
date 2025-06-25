import mongoose from 'mongoose';
import Offer from '../../models/offerModel.js';

const deleteOffer = async (req, res) => {
  try {

    const offerId = req.params.id;

    if(mongoose.Types.ObjectId.isValid(offerId)){
      return res.status(400)
      .json({success: false,
        message: "invalid offer id"
      })
    }

    const offer = await Offer.findByIdAndDelete(offerId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
      data: deleted
    });
  } catch (err) {
    console.error('Error deleting offer:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};

export default deleteOffer;
