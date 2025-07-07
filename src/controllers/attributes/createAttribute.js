import Attribute from "../../models/productAttributeModel.js";

export const createAttribute = async (req, res) => {
  try {
    const { name, isGlobal, categories, values } = req.body;

    // Check if attribute already exists (case insensitive)
    const existingAttribute = await Attribute.findOne({ name: name.toLowerCase().trim() });
    if (existingAttribute) {
      return res.status(400).json({
        success: false,
        message: 'Attribute with this name already exists'
      });
    }

    // Global attributes shouldn't have categories
    if (isGlobal && categories && categories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Global attributes cannot be assigned to specific categories'
      });
    }

    const attribute = new Attribute({
      name,
      isGlobal,
      categories: isGlobal ? [] : categories,
      values,
      isVariantAttribute: req.body.isVariantAttribute || true
    });

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