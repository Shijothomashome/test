// // services/couponService.js
// import Coupon from "../models/couponModel.js";
// import Order from "../models/orderModel.js";
// import productModel from "../models/productModel.js";

// export const validateAndApplyCoupon = async (userId, cart, couponCode) => {
//   try {
//     // Find the coupon
//     const coupon = await Coupon.findOne({
//       code: couponCode.toUpperCase(),
//       isActive: true,
//       isDeleted: false,
//       validFrom: { $lte: new Date() },
//       validTill: { $gte: new Date() }
//     }).populate('applicableProducts applicableCategories applicableBrands');

//     if (!coupon) {
//       return { valid: false, message: "Invalid or expired coupon code" };
//     }

//     // Check if cart meets minimum value requirement
//     if (cart.totalPrice < coupon.minCartValue) {
//       return {
//         valid: false,
//         message: `Minimum cart value of ${coupon.minCartValue} required for this coupon`
//       };
//     }

//     // Check first order only restriction
//     if (coupon.firstOrderOnly) {
//       const previousOrder = await Order.findOne({ userId });
//       if (previousOrder) {
//         return {
//           valid: false,
//           message: "This coupon is valid for first order only"
//         };
//       }
//     }

//     // Check per user usage limit
//     if (coupon.usageLimit?.perUser) {
//       const couponUsageCount = await Order.countDocuments({
//         userId,
//         couponCode: coupon.code
//       });
//       if (couponUsageCount >= coupon.usageLimit.perUser) {
//         return {
//           valid: false,
//           message: "You've reached the maximum usage limit for this coupon"
//         };
//       }
//     }

//     // Check total usage limit
//     if (coupon.usageLimit?.total) {
//       const totalCouponUsage = await Order.countDocuments({
//         couponCode: coupon.code
//       });
//       if (totalCouponUsage >= coupon.usageLimit.total) {
//         return {
//           valid: false,
//           message: "This coupon has reached its maximum usage limit"
//         };
//       }
//     }

//     // Check if coupon applies to any items in cart
//     if (coupon.applicableProducts.length > 0 || 
//         coupon.applicableCategories.length > 0 || 
//         coupon.applicableBrands.length > 0) {
      
//       // Get product details for all cart items
//       const productIds = cart.items.map(item => item.productId);
//       const products = await productModel.find({
//         _id: { $in: productIds }
//       }).populate('category brand');

//       // Check if any item qualifies
//       const hasQualifyingItem = products.some(product => {
//         const isProductMatch = coupon.applicableProducts.some(
//           prod => prod._id.toString() === product._id.toString()
//         );
//         const isCategoryMatch = product.category && coupon.applicableCategories.some(
//           cat => cat._id.toString() === product.category._id.toString()
//         );
//         const isBrandMatch = product.brand && coupon.applicableBrands.some(
//           brand => brand._id.toString() === product.brand._id.toString()
//         );

//         return isProductMatch || isCategoryMatch || isBrandMatch;
//       });

//       if (!hasQualifyingItem) {
//         return {
//           valid: false,
//           message: "This coupon doesn't apply to any items in your cart"
//         };
//       }
//     }

//     // Calculate discount amount
//     let discountAmount = 0;
    
//     if (coupon.discountType === 'percentage') {
//       discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
//       if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
//         discountAmount = coupon.maxDiscountAmount;
//       }
//     } else {
//       discountAmount = coupon.discountValue;
//     }

//     // Ensure discount doesn't make total negative
//     const finalAmount = Math.max(0, cart.totalPrice - discountAmount);

//     return {
//       valid: true,
//       coupon: {
//         code: coupon.code,
//         discountAmount,
//         discountType: coupon.discountType,
//         finalAmount
//       }
//     };
//   } catch (error) {
//     console.error("Error validating coupon:", error);
//     return { valid: false, message: "Error validating coupon" };
//   }
// };


import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const validateAndApplyCoupon = async (userId, cart, couponCode) => {
  try {
    // Find the coupon (case insensitive search)
    const coupon = await Coupon.findOne({
      code: { $regex: new RegExp(`^${couponCode}$`, 'i') },
      isActive: true,
      isDeleted: false,
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() }
    }).populate({
      path: 'applicableProducts applicableCategories applicableBrands',
      select: '_id'
    });

    if (!coupon) {
      return { valid: false, message: "Invalid or expired coupon code" };
    }

    // Check minimum cart value (use post-offer total)
    if (cart.totalPrice < coupon.minCartValue) {
      return {
        valid: false,
        message: `Minimum cart value of ${coupon.minCartValue} required for this coupon`
      };
    }

    // Check first order only restriction
    if (coupon.firstOrderOnly) {
      const previousOrder = await Order.findOne({ userId });
      if (previousOrder) {
        return {
          valid: false,
          message: "This coupon is valid for first order only"
        };
      }
    }

    // Check per user usage limit
    if (coupon.usageLimit?.perUser) {
      const couponUsageCount = await Order.countDocuments({
        userId,
        couponCode: coupon.code
      });
      if (couponUsageCount >= coupon.usageLimit.perUser) {
        return {
          valid: false,
          message: "You've reached the maximum usage limit for this coupon"
        };
      }
    }

    // Check total usage limit
    if (coupon.usageLimit?.total) {
      const totalCouponUsage = await Order.countDocuments({
        couponCode: coupon.code
      });
      if (totalCouponUsage >= coupon.usageLimit.total) {
        return {
          valid: false,
          message: "This coupon has reached its maximum usage limit"
        };
      }
    }

    // Check if coupon applies to any items in cart
    if (coupon.applicableProducts.length > 0 || 
        coupon.applicableCategories.length > 0 || 
        coupon.applicableBrands.length > 0) {
      
      // Get product details for all cart items
      const productIds = cart.items.map(item => item.productId);
      const products = await productModel.find({
        _id: { $in: productIds }
      }).populate('category brand', '_id');

      // Check if any item qualifies
      const hasQualifyingItem = products.some(product => {
        const isProductMatch = coupon.applicableProducts.some(
          prod => prod._id.toString() === product._id.toString()
        );
        const isCategoryMatch = product.category && coupon.applicableCategories.some(
          cat => cat._id.toString() === product.category._id.toString()
        );
        const isBrandMatch = product.brand && coupon.applicableBrands.some(
          brand => brand._id.toString() === product.brand._id.toString()
        );

        return isProductMatch || isCategoryMatch || isBrandMatch;
      });

      if (!hasQualifyingItem) {
        return {
          valid: false,
          message: "This coupon doesn't apply to any items in your cart"
        };
      }
    }

    // Calculate discount amount (on post-offer total)
    let discountAmount = 0;
    
    if (coupon.discountType === 'percentage') {
      discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't make total negative
    discountAmount = Math.min(discountAmount, cart.totalPrice);
    const finalAmount = cart.totalPrice - discountAmount;

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        name: coupon.description,
        discountAmount,
        discountType: coupon.discountType,
        finalAmount
      },
      message: "Coupon applied successfully"
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { valid: false, message: "Error validating coupon" };
  }
};