import mongoose from "mongoose";
import { BadRequestError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";

export const getProductsByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { limit } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestError("Invalid category Id");
    }

    const limitNumber = parseInt(limit) || 5;
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    const products = await productModel.aggregate([
      { $match: { category: new mongoose.Types.ObjectId(categoryId) } },

      {
        $addFields: {
          offer: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$basePrice.mrp", "$basePrice.sellingPrice"] },
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

      {
        $lookup: {
          from: "wishlists",
          let: { productId: "$_id" },
          pipeline: [
            { $match: { userId: userObjectId } },
            {
              $project: {
                hasProduct: {
                  $in: ["$$productId", "$products.productId"],
                },
              },
            },
          ],
          as: "wishlistInfo",
        },
      },

      {
        $addFields: {
          wishlist: {
            $cond: {
              if: { $gt: [{ $size: "$wishlistInfo" }, 0] },
              then: { $arrayElemAt: ["$wishlistInfo.hasProduct", 0] },
              else: false,
            },
          },
        },
      },

      {
        $project: {
          name: 1,
          description: 1,
          image: "$thumbnail",
          basePrice: 1,
          offer: 1,
          wishlist: 1,
        },
      },

      { $limit: limitNumber },
    ]);

    res.status(200).json({
      success: true,
      message: "Product data fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
