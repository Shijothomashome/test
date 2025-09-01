import mongoose from "mongoose";
import reviewModel from "../../../models/reviewModel.js";
import { BadRequestError } from "../../../constants/customErrors.js";

export const getReviewsByProductId = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { productId } = req.params;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestError("Product Id is invalid");
    }

    // Convert query params to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Fetch reviews
    const reviews = await reviewModel
      .find({ product: productId, status: "approved" })
      .populate({ path: "user", select: "name profilePic" })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Get total count for pagination
    const totalReviews = await reviewModel.countDocuments({
      product: productId,
      status: "approved",
    });

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
