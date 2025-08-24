import reviewModel from "../../../models/reviewModel.js";

export const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await reviewModel.find()
            .populate("user", "name email")
            .populate("product", "name price");

        res.status(200).json({
            message: "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        next(error)
    }
}