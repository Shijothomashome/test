import Product from "../../models/productModel.js";
export const setIsFeaturedProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            [
                {
                    $set: {
                        isFeatured: { $not: "$isFeatured" }, 
                    },
                },
            ],
            {
                new: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: ``,
            data: updatedProduct,
            success: true,
        });
    } catch (error) {
        next(error);
    }
};
