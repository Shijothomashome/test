import Coupon from "../../models/couponModel.js";



export const createCoupon = async (req, res) => {
  try {
    const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Coupon code already exists." });
    }

    const coupon = new Coupon(req.body);
    const saved = await coupon.save();
    return res.status(201).json({ success: true, message: "Coupon created successfully.", coupon: saved });
  } catch (err) {
    console.error("Create Coupon Error:", err);
    return res.status(500).json({ success: false, message: "Error creating coupon.", error: err.message });
  }
};