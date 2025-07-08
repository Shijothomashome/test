// // services/offerService.js
// import Offer from "../models/offerModel.js";
// import productModel from "../models/productModel.js";

// export const applyApplicableOffers = async (cart) => {
//   try {
//     // Get all active offers
//     const currentDate = new Date();
//     const activeOffers = await Offer.find({
//       isActive: true,
//       isDeleted: false,
//       validFrom: { $lte: currentDate },
//       validTill: { $gte: currentDate }
//     }).populate('applicableProducts applicableCategories applicableBrands');

//     if (!activeOffers.length) return cart;

//     // Get product details for all cart items
//     const productIds = cart.items.map(item => item.productId);
//     const products = await productModel.find({
//       _id: { $in: productIds }
//     }).populate('category brand');

//     // Create a map for quick product lookup
//     const productMap = products.reduce((map, product) => {
//       map[product._id.toString()] = product;
//       return map;
//     }, {});

//     // Process each cart item to apply offers
//     let totalDiscount = 0;
//     const updatedItems = cart.items.map(item => {
//       const product = productMap[item.productId.toString()];
//       if (!product) return item;

//       // Find applicable offers for this product
//       const applicableOffers = activeOffers.filter(offer => {
//         // Check if offer applies to this product specifically
//         const isProductSpecific = offer.applicableProducts.some(
//           prod => prod._id.toString() === product._id.toString()
//         );
        
//         // Check if offer applies to product's category
//         const isCategorySpecific = product.category && offer.applicableCategories.some(
//           cat => cat._id.toString() === product.category._id.toString()
//         );
        
//         // Check if offer applies to product's brand
//         const isBrandSpecific = product.brand && offer.applicableBrands.some(
//           brand => brand._id.toString() === product.brand._id.toString()
//         );

//         return isProductSpecific || isCategorySpecific || isBrandSpecific;
//       });

//       // Apply the best offer (you might want to implement priority logic)
//       if (applicableOffers.length) {
//         const bestOffer = applicableOffers[0]; // Simple implementation - take first offer
//         let discountAmount = 0;
        
//         if (bestOffer.discountType === 'percentage') {
//           discountAmount = (item.sellingPrice * bestOffer.discountValue) / 100;
//           if (bestOffer.maxDiscountAmount && discountAmount > bestOffer.maxDiscountAmount) {
//             discountAmount = bestOffer.maxDiscountAmount;
//           }
//         } else {
//           discountAmount = bestOffer.discountValue;
//         }

//         // Apply discount to item
//         const discountedPrice = item.sellingPrice - discountAmount;
//         totalDiscount += discountAmount * item.quantity;
        
//         return {
//           ...item.toObject(),
//           sellingPrice: discountedPrice,
//           originalPrice: item.sellingPrice,
//           appliedOffer: {
//             offerId: bestOffer._id,
//             discountAmount,
//             discountType: bestOffer.discountType
//           }
//         };
//       }

//       return item;
//     });

//     // Return updated cart with offers applied
//     return {
//       ...cart.toObject(),
//       items: updatedItems,
//       totalDiscount,
//       totalPrice: cart.totalPrice - totalDiscount,
//       appliedOffers: true
//     };
//   } catch (error) {
//     console.error("Error applying offers:", error);
//     return cart; // Return original cart if error occurs
//   }
// };




import Offer from "../models/offerModel.js";
import productModel from "../models/productModel.js";

export const applyApplicableOffers = async (cart) => {
  try {
    // Get all active offers
    const currentDate = new Date();
    const activeOffers = await Offer.find({
      isActive: true,
      isDeleted: false,
      validFrom: { $lte: currentDate },
      validTill: { $gte: currentDate }
    }).populate({
      path: 'applicableProducts applicableCategories applicableBrands',
      select: '_id'
    });

    console.log('Active offers:', activeOffers.map(o => o.title));

    if (!activeOffers.length) return cart;

    // Get product details for all cart items
    const productIds = cart.items.map(item => item.productId);
    const products = await productModel.find({
      _id: { $in: productIds }
    }).populate('category brand', '_id');

    // Create maps for quick lookup
    const productMap = products.reduce((map, product) => {
      map[product._id.toString()] = product;
      return map;
    }, {});

    // Process each cart item to apply offers
    let totalDiscount = 0;
    const updatedItems = cart.items.map(item => {
      const product = productMap[item.productId.toString()];
      if (!product) return item;

      // Find applicable offers for this product
      const applicableOffers = activeOffers.filter(offer => {
        // Check product-specific offers
        const productMatch = offer.applicableProducts.some(
          prod => prod._id.toString() === product._id.toString()
        );
        
        // Check category offers
        const categoryMatch = product.category && offer.applicableCategories.some(
          cat => cat._id.toString() === product.category._id.toString()
        );
        
        // Check brand offers
        const brandMatch = product.brand && offer.applicableBrands.some(
          brand => brand._id.toString() === product.brand._id.toString()
        );

        return productMatch || categoryMatch || brandMatch;
      });

      // Apply the best offer (using first matching offer for simplicity)
      if (applicableOffers.length > 0) {
        const bestOffer = applicableOffers[0];
        let discountAmount = 0;
        
        // Calculate discount based on MRP (original price)
        if (bestOffer.discountType === 'percentage') {
          discountAmount = (item.mrp * bestOffer.discountValue) / 100;
          if (bestOffer.maxDiscountAmount && discountAmount > bestOffer.maxDiscountAmount) {
            discountAmount = bestOffer.maxDiscountAmount;
          }
        } else {
          discountAmount = bestOffer.discountValue;
        }

        // Ensure discount doesn't exceed item price
        discountAmount = Math.min(discountAmount, item.mrp);
        
        // Calculate discounted price
        const discountedPrice = item.mrp - discountAmount;
        totalDiscount += discountAmount * item.quantity;
        
        return {
          ...item.toObject(),
          sellingPrice: discountedPrice,
          originalPrice: item.mrp,
          appliedOffer: {
            offerId: bestOffer._id,
            name: bestOffer.title,
            discountAmount,
            discountType: bestOffer.discountType
          }
        };
      }

      return item;
    });

    // Return updated cart with offers applied
    const updatedCart = {
      ...cart.toObject(),
      items: updatedItems,
      totalDiscount,
      totalPrice: cart.totalPrice - totalDiscount,
      appliedOffers: totalDiscount > 0
    };

    console.log('Cart after applying offers:', {
      originalTotal: cart.totalPrice,
      totalDiscount,
      newTotal: updatedCart.totalPrice,
      items: updatedCart.items.map(i => ({
        productId: i.productId,
        originalPrice: i.mrp,
        discountedPrice: i.sellingPrice
      }))
    });

    return updatedCart;
  } catch (error) {
    console.error("Error applying offers:", error);
    return cart;
  }
};