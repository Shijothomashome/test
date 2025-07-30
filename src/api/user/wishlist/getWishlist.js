import mongoose from "mongoose";
import wishlistModel from "../../../models/wishlistModel.js";

export const getWishlist = async (req, res, next) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(req.user?._id);
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
                },
            },
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
        ]);
        res.status(200).json({ success: true, data: products, message: "User wishlist fetched successfully" });
    } catch (error) {
        next(error);
    }
};
