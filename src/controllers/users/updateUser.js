import userModel from "../../models/userModel.js"; 
import s3Utils from "../../utils/s3Utils.js";

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const { name, password, profilePic, address } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (password !== undefined) user.password = password;

    // Handle profile picture update
    if (req.file) {
      const newImageUrl = await s3Utils.uploadToS3(req.file, "profilepic");
      // Delete old image from S3 if it exists
      if (user.profilePic) {
        await s3Utils.deleteFromS3(user.profilePic);
      }
      user.profilePic = newImageUrl;
    }

    // Handle address update
    if (address) {
      if (address._id) {
        const index = user.addressList.findIndex(
          (addr) => addr._id.toString() === address._id
        );
        if (index > -1) {
          user.addressList[index] = {
            ...user.addressList[index]._doc,
            ...address,
          };
        } else {
          return res.status(404).json({
            status: false,
            message: "Address not found for update",
          });
        }
      } else {
        // Add new address
        user.addressList.push(address);
      }
    }

    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    console.error("updateUser:", error);
    return res.status(500).json({
      status: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

export default updateUser;
