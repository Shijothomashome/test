import mongoose from "mongoose";
import userModel from "../../../models/userModel.js";
import { BadRequestError } from "../../../constants/customErrors.js";

export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new BadRequestError("Invalid address Id format");
    }

    const result = await userModel.updateOne(
      { _id: userId },
      { $pull: { addressList: { _id: addressId } } }
    );

    if (result.modifiedCount === 0) {
      throw new BadRequestError("Address not found or already deleted");
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
