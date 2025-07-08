// @desc    Toggle deal of the day (supports single and bulk)
// @route   PATCH /api/products/deal-of-the-day

import productModel from "../../models/productModel.js";

// @access  Private/Admin
export const toggleDealOfTheDay = async (req, res) => {
  try {
    const { productIds, isDealOfTheDay, dealDurationHours } = req.body;

    // Validate input
    if (!Array.isArray(productIds) || typeof isDealOfTheDay !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Invalid request format"
      });
    }

    // Unset any existing deals if we're setting new ones
    if (isDealOfTheDay) {
      await productModel.updateMany(
        { isDealOfTheDay: true },
        { $set: { isDealOfTheDay: false } }
      );
    }

    // Prepare update data
    const updateData = { 
      isDealOfTheDay,
      ...(isDealOfTheDay && dealDurationHours ? {
        dealExpiresAt: new Date(Date.now() + dealDurationHours * 60 * 60 * 1000)
      } : { dealExpiresAt: null })
    };

    // Update selected products
    const { modifiedCount } = await productModel.updateMany(
      { _id: { $in: productIds } },
      { $set: updateData }
    );

    // Get updated products
    const updatedProducts = await productModel.find({ _id: { $in: productIds } })
      .populate('category')
      .populate('brand');

    res.status(200).json({
      success: true,
      data: {
        updatedCount: modifiedCount,
        products: updatedProducts
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};