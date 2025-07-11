// @desc    Get current deals of the day (supports multiple)
// @route   GET /api/products/deal-of-the-day
// @access  Public
export const getDealsOfTheDay = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Base query
    const query = { 
      isDealOfTheDay: true,
      isActive: true,
      isDeleted: false,
      ...(req.query.includeExpired ? {} : { 
        $or: [
          { dealExpiresAt: { $gt: new Date() } },
          { dealExpiresAt: { $exists: false } }
        ]
      })
    };

    // Options for query
    const options = {
      limit: parseInt(limit, 10),
      sort: { dealExpiresAt: 1 }, // Sort by soonest to expire
      populate: [
        { path: 'category', select: 'name' },
        { path: 'brand', select: 'name' }
      ],
      select: '-variants', // Exclude variants field
      lean: true
    };

    // Execute query
    const deals = await Product.find(query)
      .limit(options.limit)
      .sort(options.sort)
      .populate(options.populate)
      .select(options.select)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        deals,
        count: deals.length
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};