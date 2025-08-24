import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

// @desc    Update review status (Admin)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
   console.log(status)
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = status;
    await review.save();

    res.status(200).json({success:true,message:"Review status successfully updated",review});
  } catch (error) {
    next(error)
  }
};