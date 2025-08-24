import { ConflictError, NotFoundError } from "../../../constants/customErrors.js";
import reviewModel from "../../../models/reviewModel.js";
export const likeReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;
        const review = await reviewModel.findById({_id:reviewId});
        if(!review){
            throw new notFoundError("Review not found");
        }
        const findLike = review.likes.findIndex(like => like.toString() === userId.toString());
        if(findLike !== -1){
             throw new  ConflictError("You have already liked this review");
        }

        const findDislike = review.dislikes.findIndex(dislike => dislike.toString() === userId.toString());
        if(findDislike !== -1){ 
            review.dislikes.splice(findDislike, 1);
            
        }
        review.likes.push(userId);
        await review.save();
        res.status(200).json({
            message: "Review liked successfully",
            review,
        });

    } catch (error) {
        next(error);
    }}     