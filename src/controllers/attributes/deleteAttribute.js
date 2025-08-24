import Attribute from "../../models/productAttributeModel.js";
// import { validateAttributeInput } from "../validations/attributeValidation.js";

// @desc    Delete attribute (soft delete)
// @route   DELETE /api/v1/attributes/:id
// @access  Private/Admin
export const deleteAttribute = async (req, res) => {
  try { 
    const { deletionReason } = req.body;
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found'
      });
    }

    if (attribute.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Attribute is already deleted'
      });
    }

    attribute.isDeleted = true;
    attribute.deletedAt = new Date();
    attribute.deletionReason = deletionReason || 'No reason provided';
    await attribute.save();

    res.json({
      success: true,
      message: 'Attribute deleted successfully',
      data: {
        id: attribute._id,
        deletedAt: attribute.deletedAt
      }
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
      message: 'Failed to delete attribute',
      error: error.message
    });
  }
};