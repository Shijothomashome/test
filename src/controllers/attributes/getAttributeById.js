import productAttributeModel from "../../models/productAttributeModel.js";

export const getAttributeById = async (req, res) => {
  try {
    const attributeId = req.params.id;
    
    // Log the ID for debugging
    console.log('Searching for attribute with ID:', attributeId);

    const attribute = await productAttributeModel.findOne({
      _id: attributeId
    }).populate('categories', 'name slug');

    // Log the query result for debugging
    console.log('Found attribute:', attribute);

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

    res.json({
      success: true,
      data: attribute
    });
  } catch (error) {
    console.error('Error fetching attribute:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid attribute ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};