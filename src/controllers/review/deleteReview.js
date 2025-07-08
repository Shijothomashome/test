import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";


// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is admin or review owner
    if (
      req.user.role !== "admin" &&
      review.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await review.remove();

    res.json({ message: "Review removed" });
  } catch (error) {
    handleError(res, error);
  }
};
