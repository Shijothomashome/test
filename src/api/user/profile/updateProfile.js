import { updateUserSchema } from "../../../validators/userValidator.js";
import userModel from "../../../models/userModel.js";

export const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = ["name", "email", "phone"];
        const filteredBody = {};

        for (const key of allowedFields) {
            if (req.body[key]) {
                filteredBody[key] = req.body[key];
            }
        }

        if (Object.keys(filteredBody).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Only name, email, or phone can be updated",
            });
        }

        updateUserSchema.partial().parse(filteredBody);

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            filteredBody,
            { new: true }
        ).select("-password"); 

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
