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
        $project: {
          name: 1,
          description: 1,
          image: "$thumbnail",
          basePrice: 1,
          offer: 1,
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
