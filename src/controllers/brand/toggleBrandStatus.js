import mongoose from "mongoose";
import brandModel from "../../models/brandModel.js";



export const toggleBrandStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

   if (!id) {
      return res.status(400).json({success: false, message: "Brand ID is required." });
    }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid brand ID." })
  }


  try {
    const brand = await brandModel.findOne({ _id: id, isDeleted: false })
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found." })
    }

    brand.isActive = isActive;
    await brand.save();

    res.status(200).json({
      success: true,
      message: `Brand has been ${brand.isActive ? "activated" : "deactivated"}.`,
      data: { id: brand._id, isActive: brand.isActive },
    });
  } catch (error) {
    console.error("Error updating brand status:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};