import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";


// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "user",
      "name avatar"
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    handleError(res, error);
  }
};
