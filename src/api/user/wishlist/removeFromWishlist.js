import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import wishlistModel from "../../../models/wishlistModel.js";

export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestError("Invalid product id");
    }

    const wishlist = await wishlistModel.findOne({ userId });

    if (!wishlist) {
      throw new NotFoundError("Wishlist not found");
    }

    const productIndex = wishlist.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      throw new BadRequestError("Product already removed");
    }

    if (wishlist.products.length === 1) {
      
      await wishlistModel.deleteOne({ userId });
    } else {
   
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: "Product successfully removed from the wishlist",
      productId:productId
    });
  } catch (error) {
    next(error);
  }
};
