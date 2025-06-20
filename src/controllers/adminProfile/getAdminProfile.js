import userModel from "../../models/userModel.js";
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user?._id;
    const admin = await userModel
      .findOne({ _id: adminId, isDeleted: false })
      .select("-password -googleAccessToken");
    if (!admin) {
      return res
        .status(404)
        .json({ message: "admin not found", success: false });
    }
    if (admin.role != "admin") {
      return res.status(401).json({
        message: "Unauthorized: This user is not an admin",
        success: false,
      });
    }
    return res
      .status(200)
      .json({ data: admin, message: "admin profile fetched success" });
  } catch (error) {
    console.log("getAdminProfile", error);
  }
};

export default getAdminProfile;
