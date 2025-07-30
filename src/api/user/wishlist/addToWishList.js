import mongoose from "mongoose";
import { ConflictError, NotFoundError } from "../../../constants/customErrors.js";
import wishlistModel from "../../../models/wishlistModel.js";

export const createWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req?.user?._id;

    if (!productId) throw new NotFoundError("Product id not found");

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    const wishlist = await wishlistModel.findOne({ userId: userObjectId });

    if (wishlist) {
      const alreadyExists = wishlist.products.some(
        (p) => p.productId.toString() === productId
      );

      if (!alreadyExists) {
        wishlist.products.push({
          productId: productObjectId,
          addedAt: new Date(),
        });
        await wishlist.save();
      }else{
        throw new ConflictError("Product already in wishlist")
      }
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

    res.status(200).json({ success: true, message: "Wishlist updated" });
  } catch (error) {
    next(error);
  }
};
