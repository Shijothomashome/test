// @desc    Get current deals of the day (supports multiple)
// @route   GET /api/products/deal-of-the-day

import productModel from "../../models/productModel.js";

// @access  Public
export const getDealsOfTheDay = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const deals = await productModel.find({ 
      isDealOfTheDay: true,
      isActive: true,
      ...(req.query.includeExpired ? {} : { 
        $or: [
          { dealExpiresAt: { $gt: new Date() } },
          { dealExpiresAt: { $exists: false } }
        ]
      })
    })
    .limit(parseInt(limit))
    .populate('category')
    .populate('brand')
    .sort({ dealExpiresAt: 1 }); // Sort by soonest to expire

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals
    });
  } catch (error) {
    handleError(res, error);
  }
};