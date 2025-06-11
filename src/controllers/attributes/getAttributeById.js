import Attribute from "../../models/productAttributeModel.js";
// import { validateAttributeInput } from "../validations/attributeValidation.js";

// @desc    Get single attribute
// @route   GET /api/v1/attributes/:id
// @access  Public
export const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id)
      .populate('categories', 'name slug');

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found'
      });
    }

    res.json({
      success: true,
      data: attribute
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid attribute ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};