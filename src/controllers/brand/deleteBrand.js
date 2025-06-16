import mongoose from "mongoose";
import brandModel from "../../models/brandModel.js";



export const DeleteBrand = async (req, res) => {
  const { id } = req.params;
  const { deletionReason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid brand ID." })
  }

  if (typeof deletionReason !== "string" || !deletionReason.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "`reason` is required." })
  }

  try {
    const brand = await brandModel.findOne({ _id: id, isDeleted: false })
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found or already deleted" })
    }

    brand.isDeleted = true;
    brand.deletedAt = new Date();
    brand.deletionReason = deletionReason.trim()
    await brand.save();

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
      data: { id: brand._id, deletedAt: brand.deletedAt },
    });
  } catch (error) {
    console.error("Error deleting brand:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};