import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: userId,
      product,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      product,
      rating,
      title,
      comment,
      verifiedPurchase: true, 
    });

    res.status(201).json(review);
  } catch (error) {
    handleError(res, error);
  }
};
