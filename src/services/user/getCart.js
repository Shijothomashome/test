import { NotFoundError } from "../../constants/customErrors.js";
import cartModel from "../../models/cartModel.js";

export const getLatestCart = async (userId) => {
  try {
    const cart = await cartModel
      .findOne({ userId })
      .populate({
        path: "items.productId",
        select: "variants thumbnail name",
      });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const enrichedItems = cart.items.map(item => {
      const product = item.productId;

      let variant = null;
      if (item.variantId && product?.variants?.length > 0) {
        variant = product.variants.find(
          (v) => v._id.toString() === item.variantId?.toString()
        );
      }

      // Convert product to plain object and remove `variants`
      const productWithoutVariants = {
        ...product.toObject(),
      };
      delete productWithoutVariants.variants;

      return {
        ...item.toObject(),
        productId: productWithoutVariants, // cleaned product
        variant: variant || null,
      };
    });

    return {
      ...cart.toObject(),
      items: enrichedItems,
    };
  } catch (error) {
    throw new Error("Error while finding the latest cart");
  }
};
