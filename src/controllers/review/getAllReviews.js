import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";


// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate("user", "name email profilePic")
      .populate("product", "name",)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    handleError(res, error);
  }
};
