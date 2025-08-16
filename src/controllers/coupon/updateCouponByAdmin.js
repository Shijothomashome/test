import mongoose from "mongoose";
import couponModel from "../../models/couponModel.js";



export const updateCoupon = async (req, res) => {
  try {

    
    const couponId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(couponId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    const updatableFields = [
      "code",
      "description",
      "discountType",
      "discountValue",
      "maxDiscountAmount",
      "minCartValue",
      "usageLimit",
      "firstOrderOnly",
      "validFrom",
      "validTill",
      "isActive",
      "isDeleted",
      "applicableCategories",
      "applicableBrands",
      "applicableProducts",
    ];

    const payload = updatableFields.reduce((obj, key) => {
      if (req.body[key] !== undefined) {
        obj[key] = req.body[key];
      }
      return obj;
    }, {});


    console.log(pa)
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update.",
      });
    }

    if (payload.code) {
      payload.code = payload.code.trim().toUpperCase();

      const exists = await couponModel.findOne({
        code: { $regex: `^${payload.code}$`, $options: "i" },
        _id: { $ne: couponId },
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Coupon code already exists.",
        });
      }
    }

    const updatedCoupon = await couponModel.findByIdAndUpdate(
      couponId,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon: updatedCoupon,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({
        success: false,
        errors: Object.values(err.errors).map(e => e.message),
      });
    }

    // Fallback for other errors
    console.error("Coupon Update Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};