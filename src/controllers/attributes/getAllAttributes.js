import Attribute from "../../models/productAttributeModel.js";
// import { validateAttributeInput } from "../validations/attributeValidation.js";

// @desc    Get all attributes
// @route   GET /api/v1/attributes
// @access  Public
export const getAllAttributes = async (req, res) => {
  try {
    const { isDeleted } = req.query;
    
    const filter = {};
    if (isDeleted === 'true') filter.isDeleted = true;
    if (isDeleted === 'false') filter.isDeleted = false;

    const attributes = await Attribute.find(filter)
      .populate('categories', 'name slug');

    res.json({
      success: true,
      count: attributes.length,
      data: attributes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};