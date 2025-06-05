import brandModel from "../models/brandModel.js";



export const createBrand = async (req, res) => {
  const { name, logo, } = req.body;

 if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Brand name is required" })
  }

  try {
    const brand = await brandModel.create({
      name,
      logo: logo || "",
    });

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Brand name already exists" })
    }

    console.error("createBrand error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" })
  }
};


// get all brand by admin
export const getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: brands.length,
      brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, logo, isActive } = req.body;

  const updates = {}

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