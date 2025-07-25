
import userModel from "../../../models/userModel.js";

export const getAllAddresses = async (req, res,next) => {
  try {
    const userId = req.user?._id; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found in request",
      });
    }

    const user = await userModel.findById(userId).select("addressList");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: user.addressList || [],
    });
  } catch (error) {
    next(error)
  }
};
