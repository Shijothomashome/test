import mongoose from "mongoose";
import { ConflictError, NotFoundError } from "../../../constants/customErrors.js";
import wishlistModel from "../../../models/wishlistModel.js";
import productModel from "../../../models/productModel.js"; // Make sure this exists

export const createWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req?.user?._id;

    if (!productId) throw new NotFoundError("Product id not found");

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    const wishlist = await wishlistModel.findOne({ userId: userObjectId });

    let addedProduct;

    if (wishlist) {
      const alreadyExists = wishlist.products.some(
        (p) => p.productId.toString() === productId
      );

      if (alreadyExists) {
        throw new ConflictError("Product already in wishlist");
      }

      wishlist.products.push({
        productId: productObjectId,
        addedAt: new Date(),
      });

      await wishlist.save();

    } else {
      await wishlistModel.create({
        userId: userObjectId,
        products: [
          {
            productId: productObjectId,
            addedAt: new Date(),
          },
        ],
      });
    }

    // ✅ Get the added product details
    addedProduct = await productModel.findById(productId).lean();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      productId:productId,
    });

  } catch (error) {
    next(error);
  }
};
