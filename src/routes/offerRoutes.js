import express from 'express'
import { createOffer, deleteOffer, getAllOffers, getOfferById, updateOffers } from '../controllers/offer/index.js'


const router = express.Router();

//create offer
router.post('/admin/create', createOffer);

//get all offers
router.get('/admin/all', getAllOffers);

//get all offers by id
router.get('/:id', getOfferById);

//update offers
router.put('/admin/:id/update', updateOffers);

//deleting offer 
router.delete('/admin/:id/delete', deleteOffer)

//get all offers for user
// router.get('/user/:id', getAllOffersForUser)

export default router;