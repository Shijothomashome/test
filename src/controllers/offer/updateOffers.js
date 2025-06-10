import Offer from '../../models/offerModel.js';

export const updateOffers = async (req, res) => {
    try{
        const updated = await Offer.findByIdAndUpdate(
            req.params.id,
            {...req.body, updatedAt: new Date()},
            {new: true}
        );
        if(!updated) return res.status(404).json({error: "offer not found"});
        res.json(updated);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}