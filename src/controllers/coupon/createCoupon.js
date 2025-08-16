import { BadRequestError, ConflictError } from "../../constants/customErrors.js";
import Coupon from "../../models/couponModel.js";
import { createCouponValidator } from "../../validators/couponValidator.js";
import couponValidatorSchemas from "../../validators/couponValidatorSchemas.js";



export const createCoupon = async (req, res,next) => {
  try {


    
    req.body.minCartValue = parseInt(req.body.minCartValue) || 0;
    req.body.discountValue = parseInt(req.body.discountValue) || 0;
    req.body.maxDiscountAmount = parseInt(req.body.maxDiscountAmount) || 0;
    req.body.validTill = req.body.validTill ? new Date(req.body.validTill) : undefined;
    if(req.body.validFrom){
      req.body.validFrom = new Date(req.body.validFrom);
    }
    
    if(req.body.discountType=="amount"){
      req.body.discountType="flat"
    }
     createCouponValidator.parse(req.body)
    
    const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existing) {
      throw new ConflictError("Coupon code already exist")
    }

    const coupon = new Coupon(req.body);
    const saved = await coupon.save();
    return res.status(201).json({ success: true, message: "Coupon created successfully.", coupon: saved });
  } catch (err) {
    console.error("Create Coupon Error:", err);
    next(err)
  }
};