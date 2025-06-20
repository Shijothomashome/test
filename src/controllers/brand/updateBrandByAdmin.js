import mongoose from "mongoose";
import brandModel from "../../models/brandModel.js";
import s3Util from "../../utils/s3Utils.js";

const updateBrandByAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;
  const updates = {};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid brand ID." });
  }

  try {
    const existingBrand = await brandModel.findById(id);
    if (!existingBrand || existingBrand.isDeleted) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    if (name !== undefined) {
      const trimmed = name.trim();
      if (!trimmed) {
        return res.status(400).json({ success: false, message: "Name cannot be empty" });
      }

      const duplicate = await brandModel.findOne({ name: trimmed, _id: { $ne: id }, isDeleted: false });
      if (duplicate) {
        return res.status(409).json({ success: false, message: "Brand name already exists" });
      }

      updates.name = trimmed;
    }

    if (isActive !== undefined) {
      updates.isActive = isActive; // Assumes Joi has coerced it to boolean
    }

    if (req.file) {
      if (existingBrand.logo) {
        await s3Util.deleteFromS3(existingBrand.logo);
      }
      const uploadedUrl = await s3Util.uploadToS3(req.file, "brand");
      updates.logo = uploadedUrl;
    }

    const updatedBrand = await brandModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({
      success: true,
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (err) {
    console.error("Error updating brand:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message || "Something went wrong",
    });
  }
};

export default updateBrandByAdmin;
