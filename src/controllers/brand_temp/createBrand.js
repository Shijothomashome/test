import brandModel from "../../models/brandModel.js";
import { uploadToS3 } from "../../utilities/s3Bucket.js";

export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

  
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Brand name is required." });
    }


    const existing = await brandModel.findOne({
      name: name.trim(),
      isDeleted: false,
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Brand name already exists." });
    }

    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadToS3(req.file, "brand");
    }

    const newBrand = new brandModel({
      name: name.trim(),
      logo: logoUrl,
    });

    const savedBrand = await newBrand.save();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand: savedBrand,
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export default createBrand;
