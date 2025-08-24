import { BadRequestError, ConflictError, NotFoundError } from "../../../constants/customErrors.js";
import orderModel from "../../../models/orderModel.js";
import productModel from "../../../models/productModel.js";
import reviewModel from "../../../models/reviewModel.js";
import { createReviewSchema } from "../../../validators/reviewValidatior.js";

export const createReview = async (req, res, next) => {
    try {
        

        const images = req.files? req.files.map((file) => file.location) : [];

       
        req.body.rating =  Number(req.body.rating);
        const { product, rating, title, comment } = req.body;
        
        const user = req.user._id;
        createReviewSchema.parse(req);
        const productData = await productModel.findById(product);
        if (!productData) throw new NotFoundError("Product not found");

        const alreadyReviewed = await reviewModel.findOne({ user, product });
        if (alreadyReviewed) {
            throw new ConflictError("You have already reviewed this product");
        }

        const verifiedPurchase = await orderModel.findOne({ userId: user, "items.productId": product });
        if (!verifiedPurchase) {
            throw new BadRequestError("You can only review products you have purchased");
        }

        const review = await reviewModel.create({
            user,
            product,
            rating,
            title,
            comment,
            verifiedPurchase: true,
            images
        });

        res.status(201).json({
            message: "Review created successfully",
            review,
        });
    } catch (error) {
        next(error);
    }
};
