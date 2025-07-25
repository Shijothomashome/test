import { BadRequestError } from "../../../constants/customErrors.js";
import userModel from "../../../models/userModel.js";
import { addressValidation } from "../../../validators/addressValidation.js";


export const createAddress = async (req, res, next) => {
  try {
    const userId = req?.user?._id;

    
    addressValidation.parse(req.body);

    const { isDefault } = req.body;

    if (isDefault) {
      await userModel.updateOne(
        { _id: userId, "addressList.isDefault": true },
        { $set: { "addressList.$[].isDefault": false } }
      );
    }

    
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { addressList: req.body } }
    );

    const user = await userModel.findById(userId);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    
    const newAddress = user.addressList[user.addressList.length - 1];

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    next(error);
  }
};
