import { BadRequestError } from "../../../constants/customErrors.js";
import userModel from "../../../models/userModel.js";
import mongoose from "mongoose";


export const getAddressById = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { addressId } = req.params;
 
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            throw new BadRequestError("Invalid address ID");
        }

        const user = await userModel.findOne({ _id: userId, "addressList._id": addressId }, { "addressList.$": 1 });

        if (!user || !user.addressList?.length) {
            throw new BadRequestError("Address not found");
        }

        return res.status(200).json({
            success: true,
            message: "Address fetched successfully",
            data: user.addressList[0],
        });
    } catch (error) {
        next(error);
    }
};
