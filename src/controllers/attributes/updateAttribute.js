import Attribute from "../../models/productAttributeModel.js";

// @desc    Update attribute
// @route   PUT /api/v1/attributes/:id
// @access  Private/Admin
export const updateAttribute = async (req, res) => {
  try {

    const { name, isGlobal } = req.body;
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found'
      });
    }

    // Check if name is being changed to an existing one
    if (name && name !== attribute.name) {
      const existingAttribute = await Attribute.findOne({ name });
      if (existingAttribute) {
        return res.status(400).json({
          success: false,
          message: 'Attribute with this name already exists'
        });
      }
    }

    // Prevent changing global status if categories exist
    if (isGlobal !== undefined && isGlobal !== attribute.isGlobal) {
      if (!isGlobal && attribute.categories.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Non-global attributes must have at least one category'
        });
      }

      if (isGlobal && attribute.categories.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot make attribute global - it already has categories assigned'
        });
      }
    }

    Object.assign(attribute, req.body);
    await attribute.save();

    res.json({
      success: true,
      message: 'Attribute updated successfully',
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
      message: 'Failed to update attribute',
      error: error.message
    });
  }
};