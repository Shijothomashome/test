import Attribute from "../../models/productAttributeModel.js";

// @desc    Create new attribute
// @route   POST /api/v1/attributes
// @access  Private/Admin
export const createAttribute = async (req, res) => {
  try {
    const { name, isGlobal } = req.body;

    // Check if attribute already exists
    const existingAttribute = await Attribute.findOne({ name });
    if (existingAttribute) {
      return res.status(400).json({
        success: false,
        message: 'Attribute with this name already exists'
      });
    }

    // Global attributes shouldn't have categories
    if (isGlobal && req.body.categories && req.body.categories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Global attributes cannot be assigned to specific categories'
      });
    }

    const attribute = new Attribute(req.body);
    await attribute.save();

    res.status(201).json({
      success: true,
      message: 'Attribute created successfully',
      data: attribute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create attribute',
      error: error.message
    });
  }
};