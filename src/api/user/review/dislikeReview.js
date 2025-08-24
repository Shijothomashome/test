import { ConflictError, NotFoundError } from "../../../constants/customErrors.js";
import reviewModel from "../../../models/reviewModel.js";

export const dislikeReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;
        const review = await reviewModel.findById({_id:reviewId});
        if(!review){
            throw new NotFoundError("Review not found");
        }
        const findDislike = review.dislikes.findIndex(like => like.toString() === userId.toString());
        if(findDislike !== -1){
             throw new  ConflictError("You have already Disliked this review");
        }

        const findLIke = review.likes.findIndex(like => like.toString() === userId.toString());
        if(findLIke !== -1){ 
            review.likes.splice(findDislike, 1);
            
        }
        review.dislikes.push(userId);
        await review.save();
        res.status(200).json({
            message: "Review Disliked  successfully",
            review,
        });

    } catch (error) {
        next(error);
    }}     