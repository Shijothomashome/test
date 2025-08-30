import mongoose from "mongoose";
import wishlistModel from "../../../models/wishlistModel.js";
import { BadRequestError } from "../../../constants/customErrors.js";

export const getWishlist = async (req, res, next) => {
    try {
        const { page = 1, limit = 15, category = "" } = req.query;
        const userObjectId = new mongoose.Types.ObjectId(req.user?._id);

        

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const categoryCheckMatchStage = {};

        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            throw new BadRequestError("Invalid parent category Id");
        }
        if (category) {
            categoryCheckMatchStage.$match = { category: new mongoose.Types.ObjectId(category) };
        } else {
            categoryCheckMatchStage.$match = {};
        }

        const products = await wishlistModel.aggregate([
            { $match: { userId: userObjectId } },
            { $unwind: "$products" },
            { $project: { productId: "$products.productId", addedAt: "$products.addedAt" } },
            { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productData" } },
            { $unwind: "$productData" },
            {
                $project: {
                    addedAt: 1,
                    name: "$productData.name",
                    description: "$productData.description",
                    basePrice: "$productData.basePrice",
                    _id: "$productData._id",
                    image: "$productData.thumbnail",
                    category: "$productData.category",
                },
            },
            
             categoryCheckMatchStage,
            {
                $addFields: {
                    offer: {
                        $round: [
                            {
                                $multiply: [
                                    {
                                        $divide: [{ $subtract: ["$basePrice.mrp", "$basePrice.sellingPrice"] }, "$basePrice.mrp"],
                                    },
                                    100,
                                ],
                            },
                            0,
                        ],
                    },
                },
            },
            { $sort: { addedAt: -1 } }, // Optional: Most recent first
            { $skip: skip },
            { $limit: parseInt(limit) },
        ]);


        console.log(products)

        res.status(200).json({
            success: true,
            data: products,
            message: "User wishlist fetched successfully",
            page: parseInt(page),
            totalPages: products.length,
            limit: parseInt(limit),
        });
    } catch (error) {
        next(error);
    }
};
