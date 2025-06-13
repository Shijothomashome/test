import Offer from '../../models/offerModel.js';

const deleteOffer = async (req, res) => {
    try{
        const deleted = await Offer.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({error: 'offer not found'})
            res.json({message: 'offer deleted'})
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

export default deleteOffer;