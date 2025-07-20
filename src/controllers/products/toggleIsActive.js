import { NotFoundError } from "../../constants/customErrors.js";
import Product from "../../models/productModel.js";

export const toggleProductStatus = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      [
        {
          $set: {
            isActive: { $not: "$isActive" }, // toggle isActive field
          },
        },
      ],
      { new: true }
    );

    if (!updatedProduct) {
      throw new NotFoundError("Product not found")
    }

    res.status(200).json({
      message: `Product is now ${updatedProduct.isActive ? "active" : "inactive"}.`,
      data: updatedProduct,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
