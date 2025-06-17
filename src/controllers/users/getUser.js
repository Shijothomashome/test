import userModel from "../../models/userModel.js";
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel
      .findOne({ _id: userId, isDeleted: false })
      .select("-password -googleAccessToken");
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }
    return res
      .status(200)
      .json({ data: user, message: "user profile fetched success" });
  } catch (error) {
    console.log("getUserProfile", error);
  }
};

export default getUser;
