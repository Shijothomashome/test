import { BadRequestError } from "../../../constants/customErrors.js";
import reviewModel from "../../../models/reviewModel.js";

export const updateReviewStatus = async (req, res, next) => {   
    try {
        const { reviewId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["approved", "rejected", "pending"].includes(status)) {
           throw new BadRequestError("Invalid status. Allowed values are 'approved', 'rejected', or 'pending'.");
        }

        // Find the review by ID
        const review = await reviewModel.findById(reviewId);
        if (!review) {
            throw new NotFoundError("Review not found");
        }

        // Update the review status
        review.status = status;
        await review.save();

        res.status(200).json({
            message: "Review status updated successfully",
            review,
        });
    } catch (error) {
        next(error)
    }
}