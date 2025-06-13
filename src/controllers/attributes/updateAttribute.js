import Attribute from "../../models/productAttributeModel.js";

export const updateAttribute = async (req, res) => {
  try {
    const { name, isGlobal, values, isVariantAttribute, isActive } = req.body;
    const attribute = await Attribute.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found or has been deleted'
      });
    }

    // Check if name is being changed to an existing one
    if (name && name !== attribute.name) {
      const existingAttribute = await Attribute.findOne({ 
        name: name.toLowerCase().trim(),
        _id: { $ne: attribute._id }
      });
      if (existingAttribute) {
        return res.status(400).json({
          success: false,
          message: 'Attribute with this name already exists'
        });
      }
    }

    // Prevent changing global status if categories exist
    if (isGlobal !== undefined && isGlobal !== attribute.isGlobal) {
      if (!isGlobal && (!attribute.categories || attribute.categories.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'Non-global attributes must have at least one category'
        });
      }

      if (isGlobal && attribute.categories && attribute.categories.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot make attribute global - it already has categories assigned'
        });
      }
    }

    // Update only allowed fields
    const updates = {
      name: name || attribute.name,
      isGlobal: isGlobal !== undefined ? isGlobal : attribute.isGlobal,
      values: values || attribute.values,
      isVariantAttribute: isVariantAttribute !== undefined ? isVariantAttribute : attribute.isVariantAttribute,
      isActive: isActive !== undefined ? isActive : attribute.isActive,
      categories: isGlobal ? [] : (req.body.categories || attribute.categories)
    };

    Object.assign(attribute, updates);
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