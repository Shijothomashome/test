import Offer from '../../models/offerModel.js';


const getAllOffers = async (req, res) => {
    try{
        const {isActive, valid} = req.query;
        const query = {};

        if(isActive !==undefined) query.isActive = isActive === "true";
        if(valid === "true"){
            const now = new date();
            query.validFrom = {$lte: now};
            query.validTill = {$gte: now}
        }
        const offers = await Offer.find(query);
        res.json({offers})
    }catch(err){
        res.satus(400).json({error: err.message})
    }
}

export default getAllOffers;