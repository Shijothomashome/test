import userModel from "../../models/userModel.js";

const deleteAdminProfile = async (req, res) => {
  try {
    const { deletionReason } = req.body || {};
    const adminId = req.user._id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: admin not found in request.",
      });
    }

    if (!deletionReason || typeof deletionReason !== "string") {
      return res.status(400).json({
        success: false,
        message: "deletionReason is required and must be a string.",
      });
    }

    const admin = await userModel.findOneAndUpdate(
      { _id: adminId, isDeleted: { $ne: true } },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletionReason,
        },
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "admin not found or already deleted.",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully.", admin });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export default deleteAdminProfile;
