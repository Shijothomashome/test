import mongoose from "mongoose";
import { BadRequestError } from "../../../constants/customErrors.js";
import categoryModel from "../../../models/categoryModel.js";

export const getCategoriesAndSubCategories = async (req, res, next) => {
  try {
    const { parent_id, type } = req.query;

    if (type !== "all" && type !== "selected") {
      throw new BadRequestError("Invalid query params");
    }

    if (
      type === "selected" &&
      (!parent_id || !mongoose.Types.ObjectId.isValid(parent_id))
    ) {
      throw new BadRequestError("Invalid or missing category ID");
    }

    // Parent Categories
    const parentCategories = await categoryModel.aggregate([
      {
        $match: {
          parentCategory: null,
          isActive: true,
          isDeleted: false,
        },
      },
      { $project: { name: 1 } },
    ]);

    let subCategories = [];

    if (type === "all") {
      subCategories = await categoryModel.aggregate([
        {
          $match: {
            parentCategory: { $ne: null },
            isActive: true,
            isDeleted: false,
          },
        },
        { $project: { image: 1, name: 1 } },
      ]);
    }

    if (type === "selected") {
      subCategories = await categoryModel.aggregate([
        {
          $match: {
            parentCategory: new mongoose.Types.ObjectId(parent_id),
            isActive: true,
            isDeleted: false,
          },
        },
        { $project: { image: 1, name: 1 } },
      ]);
    }

    res.status(200).json({
      success: true,
      message: "Category data fetched successfully",
      data: {
        parentCategories,
        subCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};
