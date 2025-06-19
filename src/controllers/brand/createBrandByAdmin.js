import brandModel from "../../models/brandModel.js";
import s3Utils from "../../utils/s3Utils.js";

const createBrandByAdmin = async (req, res) => {
  try {
    const { isActive = true } = req.body;
    const trimmedName = req.body.name?.trim();

    const existing = await brandModel.findOne({
      name: trimmedName,
      isDeleted: false,
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Brand name already exists." });
    }

    let logoUrl = null;
    if (req.file) {
      logoUrl = await s3Utils.uploadToS3(req.file, "brand");
    }

    const newBrand = new brandModel({
      name: trimmedName,
      logo: logoUrl,
      isActive,
    });

    const savedBrand = await newBrand.save();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand: savedBrand,
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Something went wrong",
    });
  }
};

export default createBrandByAdmin;
