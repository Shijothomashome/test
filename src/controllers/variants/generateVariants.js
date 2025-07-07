//! Generate variants for a product
//* @desc    Generate variants for a product based on attributes
//* @route   POST /api/v1/products/:id/generate-variants
//* @access  Private (Admin)

// This endpoint allows admins to generate product variants based on specified attributes.
// It updates the product's variant configuration and marks it for auto-generation.
// Note: Ensure that the Product model has the necessary fields for variant generation.
// This endpoint also supports grouping variants by specified attributes and auto-generating them.

export const generateVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantAttributes, variantGroupBy } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    // Update variant configuration
    product.variantAttributes = variantAttributes;
    product.variantGroupBy = variantGroupBy;
    product.variantGeneration.autoGenerate = true;

    await product.save();

    res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    handleError(res, error);
  }
};


// import mongoose from "mongoose";
// import { generateSKU } from "../../helpers/generateSKU.js";
// import { handleError } from "../../helpers/handleError.js";
// import { calculateVariantPrice, calculateVariantStock, generateVariantCombinations } from "../../helpers/variantHelper.js";

// export const generateVariants = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const { 
//       variantAttributes, 
//       variantGroupBy, 
//       variantGeneration,
//       productName = "" // Optional product name for SKU generation
//     } = req.body;

//     // Validate input
//     if (!variantAttributes || !Array.isArray(variantAttributes) || variantAttributes.length === 0) {
//       throw new Error("At least one variant attribute is required");
//     }

//     // Get attributes with their values
//     const attributes = await mongoose
//       .model("Attribute")
//       .find({
//         _id: { $in: variantAttributes },
//         isVariantAttribute: true
//       })
//       .session(session)
//       .lean();

//     if (attributes.length !== variantAttributes.length) {
//       throw new Error("Some attributes were not found or are not valid for variants");
//     }

//     // Generate all possible combinations
//     const combinations = generateVariantCombinations(
//       attributes.map(attr => ({
//         attribute: attr._id,
//         name: attr.name,
//         values: attr.values || []
//       })),
//       variantGroupBy
//     );

//     // Create variants according to your schema
//     const variants = combinations.map(combo => {
//       const price = calculateVariantPrice(variantGeneration, combo.attributes);
//       const stock = calculateVariantStock(variantGeneration, combo.attributes, variantGeneration.initialStock || 0);

//       return {
//         sku: generateSKU(productName, combo.attributes),
//         attributes: combo.attributes.map(attr => ({
//           attribute: attr.attribute,
//           value: attr.value
//         })),
//         variantGroup: combo.variantGroup || undefined,
//         price: {
//           mrp: price.mrp,
//           sellingPrice: price.sellingPrice,
//           costPrice: price.costPrice || undefined // Optional field
//         },
//         inventory: {
//           stock: stock,
//           lowStockThreshold: variantGeneration.lowStockThreshold || 5,
//           backOrder: variantGeneration.backOrder || false,
//           trackInventory: variantGeneration.trackInventory !== false
//         },
//         isActive: true,
//         isPublished: true
//         // Other fields can be added as needed
//       };
//     });

//     await session.commitTransaction();
    
//     res.status(200).json({
//       success: true,
//       data: {
//         variants,
//         count: variants.length
//       }
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     handleError(res, error);
//   } finally {
//     session.endSession();
//   }
// };