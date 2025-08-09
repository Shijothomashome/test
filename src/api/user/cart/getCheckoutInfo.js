import { NotFoundError } from "../../../constants/customErrors.js";
import cartModel from "../../../models/cartModel.js";
import userModel from "../../../models/userModel.js";

export const getCheckoutInfo = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        const cart = await cartModel.findOne({ userId: userId });
        if (!cart) {
            throw new NotFoundError("Cart not found");
        }
        const user = await userModel.findOne({ _id: userId });

        const address = user?.addressList;
        return res.status(200).json({ success: true, message: "", address: address ? address : [], cart });
    } catch (error) {
        next(error);
    }
};
