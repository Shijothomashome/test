import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.status = "pending"; // Set back to pending for admin approval

    const updatedReview = await review.save();

    res.json(updatedReview);
  } catch (error) {
    handleError(res, error);
  }
};