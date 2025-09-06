import mongoose from "mongoose";
import wishlistModel from "../../../models/wishlistModel.js";
import { BadRequestError } from "../../../constants/customErrors.js";
import categoryModel from "../../../models/categoryModel.js";

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
      const childCategories = await categoryModel.find({
        parentCategory: new mongoose.Types.ObjectId(category),
      });
      const categoryObjectIds = childCategories.map((i) => i?._id);
      categoryCheckMatchStage.$match = {
        category: { $in: categoryObjectIds },
      };
    } else {
      categoryCheckMatchStage.$match = {};
    }

    const products = await wishlistModel.aggregate([
      { $match: { userId: userObjectId } },
      { $unwind: "$products" },
      {
        $project: {
          productId: "$products.productId",
          addedAt: "$products.addedAt",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },

      // ⭐ Lookup reviews (only approved)
      {
        $lookup: {
          from: "reviews",
          let: { productId: "$productData._id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$product", "$$productId"] },
                status: "approved",
              },
            },
            { $project: { rating: 1 } },
          ],
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $round: [{ $avg: "$reviews.rating" }, 1] },
              0,
            ],
          },
          ratingCount: {
            $size: {
              $filter: {
                input: "$reviews",
                as: "r",
                cond: { $ifNull: ["$$r.rating", false] }, // count only reviews with rating
              },
            },
          },
        },
      },
      { $project: { reviews: 0 } },

      {
        $project: {
          addedAt: 1,
          name: "$productData.name",
          description: "$productData.description",
          basePrice: "$productData.basePrice",
          _id: "$productData._id",
          image: "$productData.thumbnail",
          category: "$productData.category",
          averageRating: 1,
          ratingCount: 1, // ✅ include rating count
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
                    $divide: [
                      {
                        $subtract: [
                          "$basePrice.mrp",
                          "$basePrice.sellingPrice",
                        ],
                      },
                      "$basePrice.mrp",
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { addedAt: -1 } }, // Most recent first
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({
      success: true,
      data: products,
      message: "User wishlist fetched successfully",
      page: parseInt(page),
      totalPages: Math.ceil(products.length / parseInt(limit)),
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};
