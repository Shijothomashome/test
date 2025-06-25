import Offer from '../../models/offerModel.js';

const getOfferById = async (req, res) => {
    try{
        const offer = await Offer.findById(req.params.id);
        if(!offer)res.status(404).json({error: "offer not found"});
        res.json({
            success: true,
            message: "offer fetched successfully",
            data: offer,
        });
    }catch(err){
    console.error('Error fetching offers:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    })    }
};

export default getOfferById;