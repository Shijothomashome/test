import userModel from "../../models/userModel.js";
import { NotFoundError } from "../../constants/customErrors.js";

export const toggleUserBlocked = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            [
                {
                    $set: {
                        isBlocked: { $not: "$isBlocked" },
                    },
                },
            ],
            { new: true }
        );

        if (!updatedUser) {
            throw new NotFoundError("User not found");
        }

        return res.status(200).json({
            success: true,
            message: `User isBlocked is now ${updatedUser.isBlocked}`,
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
