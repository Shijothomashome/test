import Offer from '../../models/offerModel.js';

const getOfferById = async (req, res) => {
    try{
        const offer = await Offer.findById(req.params.id);
        if(!offer)res.status(404).json({error: "offer not found"});
        res.json(offer);
    }catch(err){
        res.status(400).json({error: err.message});
    }
};

export default getOfferById;