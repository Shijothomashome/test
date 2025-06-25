import express from 'express'
import offerControllers from '../controllers/offer/index.js'
import offerValidatorSchemas from "../validators/index.js";
import middlewares from "../middlewares/index.js";


const router = express.Router();

//create offer
router.post('/admin/create', middlewares.validatorMiddleware(offerValidatorSchemas.createOfferSchema), offerControllers.createOffer);

//get all offers
router.get('/admin/all', offerControllers.getAllOffers);

//get all offers by id
router.get('/:id', offerControllers.getOfferById);

//update offers
router.put('/admin/:id/update', middlewares.validatorMiddleware(offerValidatorSchemas.updateOfferSchema), offerControllers.updateOffers);

//deleting offer 
router.delete('/admin/:id/delete', middlewares.validatorMiddleware(offerValidatorSchemas.deleteOfferSchema), offerControllers.deleteOffer)

//get all offers for user
// router.get('/user/:id', getAllOffersForUser)

export default router;