import Attribute from "../../models/productAttributeModel.js";

export const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('categories', 'name slug');

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found or has been deleted'
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