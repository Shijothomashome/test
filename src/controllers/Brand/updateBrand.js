import mongoose from "mongoose";
import brandModel from "../../models/brandModel.js";


export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, logo, isActive } = req.body;

  const updates = {}

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid brand ID." })
    }

  if (name !== undefined) {
    const trimmed = name.trim()
    if (!trimmed) {
      return res
        .status(400)
        .json({ success: false, message: "Name cannot be empty" })
    }
    updates.name = trimmed;
  }
  if (logo !== undefined) updates.logo = logo;
  if (isActive !== undefined) updates.isActive = isActive

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No fields to update" })
  }

  try {
    const brand = await brandModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!brand || brand.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" })
    }

    return res.json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid brand id." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};