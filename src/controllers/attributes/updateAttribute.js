import mongoose from 'mongoose';
import Attribute from "../../models/productAttributeModel.js";

export const updateAttribute = async (req, res) => {
  try {
    // Validate ID format first
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attribute ID format'
      });
    }

    // Find attribute without isDeleted filter initially
    const attribute = await Attribute.findById(req.params.id)
      .populate('categories', 'name slug');

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found'
      });
    }

    if (attribute.isDeleted) {
      return res.status(410).json({
        success: false,
        message: 'Attribute has been deleted'
      });
    }

    const { 
      name, 
      isGlobal = attribute.isGlobal, 
      values, 
      isVariantAttribute, 
      isActive 
    } = req.body;

    // Name uniqueness check
    if (name && name.toLowerCase().trim() !== attribute.name.toLowerCase()) {
      const existingAttribute = await Attribute.findOne({
        name: name.toLowerCase().trim(),
        _id: { $ne: attribute._id }
      });
      
      if (existingAttribute) {
        return res.status(400).json({
          success: false,
          message: 'Attribute name already exists'
        });
      }
    }

    // Global status change validation
    if (isGlobal !== attribute.isGlobal) {
      if (isGlobal && attribute.categories?.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot make attribute global - remove categories first'
        });
      }

      if (!isGlobal && (!req.body.categories || req.body.categories.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'Non-global attributes require at least one category'
        });
      }
    }

    // Prepare updates
    const updates = {
      name: name ? name.trim().toLowerCase() : attribute.name,
      values: values || attribute.values,
      isGlobal,
      isVariantAttribute: isVariantAttribute !== undefined ? isVariantAttribute : attribute.isVariantAttribute,
      isActive: isActive !== undefined ? isActive : attribute.isActive,
      categories: isGlobal ? [] : (req.body.categories || attribute.categories)
    };

    // Apply updates
    Object.assign(attribute, updates);
    const updatedAttribute = await attribute.save();

    res.json({
      success: true,
      message: 'Attribute updated successfully',
      data: updatedAttribute
    });

  } catch (error) {
    console.error('Update attribute error:', error);
    
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