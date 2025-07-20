import { NotFoundError } from "../../constants/customErrors.js";
import Product from "../../models/productModel.js";

export const getProductImages = async (req, res, next) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId).select("thumbnail images");

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        res.status(200).json({
            success: true,

            data: {
                thumbnail: product.thumbnail,
                images: product.images,
            },
        });
    } catch (error) {
        next(error);
    }
};
