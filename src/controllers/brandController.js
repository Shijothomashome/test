import mongoose from "mongoose";
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
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = Math.max(parseInt(page, 10), 1);
    const pageSize = Math.max(parseInt(limit, 10), 1);

    const filter = {
      isDeleted: false,
      ...(search.trim() && { name: { $regex: search.trim(), $options: "i" } }),
    };

    const totalCount = await brandModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const brands = await brandModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      meta: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        pageSize,
      },
      data: brands,
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


export const DeleteBrand = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid brand ID." })
  }

  if (typeof reason !== "string" || !reason.trim()) {
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
    brand.deletionReason = reason.trim()
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

//get all brand Customer-facing 
export const getCustomerBrands = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = Math.max(parseInt(page, 10), 1)
    const pageSize = Math.max(parseInt(limit, 10), 1)

    const filter = {
      isDeleted: false,
      isActive: true,
      ...(search.trim() && { name: { $regex: search.trim(), $options: "i" } }),
    };

    const totalCount = await brandModel.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / pageSize) 

    const brands = await brandModel
      .find(filter)
      .sort({ name: 1 }) 
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      meta: { totalCount, totalPages, currentPage: pageNum, pageSize },
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching customer brands:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};