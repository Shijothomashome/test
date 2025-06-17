import userModel from "../../models/userModel.js";

const deleteUserProfile = async (req, res) => {
  try {
    const { deletionReason } = req.body || {};
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: User not found in request.",
        });
    }

    if (!deletionReason || typeof deletionReason !== "string") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Deletion reason is required and must be a string.",
        });
    }

    const user = await userModel.findOneAndUpdate(
      { _id: userId, isDeleted: { $ne: true } },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletionReason,
        },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found or already deleted.",
        });
    }

    return res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully.", user });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export default deleteUserProfile;
