import mongoose from "mongoose";
import { BadRequestError, ConflictError, NotFoundError } from "../../constants/customErrors.js";
import categoryModel from "../../models/categoryModel.js";
import s3Utils from "../../utils/s3Utils.js";

const createCategoryByAdmin = async (req, res) => {
    try {
        const { name, parentCategoryId, isActive = true } = req.body;
        if (parentCategoryId && mongoose.Types.ObjectId.isValid(parentCategoryId) == false) {
            throw new BadRequestError("Invalid parent category Id");
        }
        const trimmedName = name?.trim();

        // Check for duplicate category name
        const existingName = await categoryModel
            .findOne({
                name: trimmedName,
                isDeleted: false,
            })
            .lean();

        if (existingName) {
            throw new ConflictError("Category name already taken");
        }

        let parent = null;

        if (parentCategoryId) {
            const parentExists = await categoryModel.findById(parentCategoryId).lean();

            if (!parentExists) {
                throw new NotFoundError("Parent category not found");
            }

            parent = parentCategoryId;
        }

        let imageUrl = null;

        if (req.file) {
            imageUrl = await s3Utils.uploadToS3(req.file, "category");
        }
        const newCategory = new categoryModel({
            name: trimmedName,
            parentCategoryId: parent,
            isActive,
            image: imageUrl,
        });

        const savedCategory = await newCategory.save();

        return res.status(201).json({
            success: true,
            message: "New category created successfully.",
            data: savedCategory,
        });
    } catch (error) {
        next(error);
    }
};

export default createCategoryByAdmin;
