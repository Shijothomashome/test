import express from 'express';
import offerControllers from '../controllers/offer/index.js';
import offerValidatorSchemas from "../validators/index.js";
import middlewares from "../middlewares/index.js";
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// ADMIN ROUTES
// Create offer - Admin only
router.post('/admin/offers', 
//   authenticate(['admin']),
  middlewares.validatorMiddleware(offerValidatorSchemas.createOfferSchema), 
  offerControllers.createOffer
);

// Get all offers - Admin only 
router.get('/admin/offers', 
//   authenticate(['admin']),
  offerControllers.getAllOffers
);

// Get offer by ID - Public access (no authentication needed)
router.get('/offers/:id', 
  offerControllers.getOfferById
);

// Update offer - Admin only
router.put('/admin/offers/:id', 
//   authenticate(['admin']),
  middlewares.validatorMiddleware(offerValidatorSchemas.updateOfferSchema), 
  offerControllers.updateOffers
);

// Delete offer - Admin only
router.delete('/admin/offers/:id', 
//   authenticate(['admin']),
  middlewares.validatorMiddleware(offerValidatorSchemas.deleteOfferSchema), 
  offerControllers.deleteOffer
);

// USER ROUTES (commented out but ready for implementation)
// router.get('/user/:id',
//   authenticate(),
//   getAllOffersForUser
// );

export default router;