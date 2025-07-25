import mongoose from "mongoose";
import userModel from "../../../models/userModel.js";
import { addressValidation } from "../../../validators/addressValidation.js";
import { BadRequestError } from "../../../constants/customErrors.js";

export const updateAddress = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new BadRequestError("Invalid address Id format");
    }

    addressValidation.partial().parse(req.body);

    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const addressIndex = user.addressList.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw new BadRequestError("Address not found");
    }

    // If setting current address as default, unset others
    if (req.body.isDefault === true) {
      user.addressList.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const currentAddress = user.addressList[addressIndex];
    Object.assign(currentAddress, req.body);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addressList[addressIndex],
    });
  } catch (error) {
    next(error);
  }
};
