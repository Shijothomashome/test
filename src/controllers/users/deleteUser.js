import userModel from "../../models/userModel.js";
import { NotFoundError } from "../../constants/customErrors.js";

export const toggleUserDeletion = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            [
                {
                    $set: {
                        isDeleted: { $not: "$isDeleted" },
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
            message: `User isDeleted is now ${updatedUser.isDeleted}`,
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
