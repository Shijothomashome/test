import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

// @desc    Toggle review helpfulness
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const toggleHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    const userId = req.user._id;

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isLiked = review.likes.includes(userId);
    const isDisliked = review.dislikes.includes(userId);

    if (req.query.action === "like") {
      if (isLiked) {
        review.likes.pull(userId);
      } else {
        review.likes.push(userId);
        review.dislikes.pull(userId);
      }
    } else if (req.query.action === "dislike") {
      if (isDisliked) {
        review.dislikes.pull(userId);
      } else {
        review.dislikes.push(userId);
        review.likes.pull(userId);
      }
    }

    review.helpfulCount = review.likes.length - review.dislikes.length;
    await review.save();

    res.json({
      likes: review.likes.length,
      dislikes: review.dislikes.length,
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    handleError(res, error);
  }
};