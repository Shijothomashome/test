import userModel from "../../models/userModel.js";

const getAllUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role ="customer",
      isBlocked,
      isDeleted,
      search = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc", // "asc" or "desc"
    } = req.query;

    const query = {};

    if (name) query.name = new RegExp(name, "i");
    if (email) query.email = new RegExp(email, "i");
    if (phone) query.phone = new RegExp(phone, "i");
    if (role) query.role = role;
    if (isBlocked !== undefined) query.isBlocked = isBlocked === "true";
    if (isDeleted !== undefined) query.isDeleted = isDeleted === "true";

    // Search across name, email, phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const users = await userModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await userModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default getAllUsers;
