import Wishlist from "../../models/wishlistModel.js";
import userModel from "../../models/userModel.js";
const getWishlist = async (req, res) => {
  try {
    const userId = "68497b8c9b334bd04e5b107f";
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
export default getWishlist;
