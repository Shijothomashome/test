//! This file handles the creation of a product in the e-commerce system.
//! in this file , products id will save to collection products model
//! This is the main controller for creating products, handling variants, and managing collections.

// import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel.js";
// import { generateSlug } from "../../helpers/generateSlug.js";
// import { generateSKU } from "../../helpers/generateSKU.js";
// import { handleError } from "../../helpers/handleError.js";

// import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel.js";
// import { generateSlug } from "../../helpers/generateSlug.js";
// import { generateSKU } from "../../helpers/generateSKU.js";
// import { handleError } from "../../helpers/handleError.js";
// import { generateVariantCombinations } from "../../helpers/variantHelper.js";
// import mongoose from "mongoose";

// export const createProduct = async (req, res) => {
//   try {
//     const productData = req.body;

//     // Validate required fields
//     if (!productData.name || !productData.category) {
//       throw new Error("Name and category are required");
//     }

//     // Generate slug if not provided
//     if (!productData.slug) {
//       productData.slug = generateSlug(productData.name);
//     }

//     // Handle variant generation if needed
//     if (productData.variantAttributes?.length > 0) {
//       const attributes = await mongoose
//         .model("Attribute")
//         .find({
//           _id: { $in: productData.variantAttributes },
//           isVariantAttribute: true,
//         })
//         .lean();

//       if (attributes.length > 0) {
//         const attrValuePairs = attributes.map((attr) => ({
//           attribute: attr._id,
//           values: attr.values,
//         }));

//         const newCombinations = generateVariantCombinations(
//           attrValuePairs,
//           productData.variantGroupBy
//         );

//         if (productData.variantGeneration?.autoGenerate) {
//           productData.variants = newCombinations.map((combo) => ({
//             attributes: combo.attributes,
//             variantGroup: combo.variantGroup,
//             sku: generateSKU(productData.name, combo.attributes),
//             price: {
//               mrp: productData.variantGeneration.basePrice || 0,
//               sellingPrice: productData.variantGeneration.basePrice || 0,
//               costPrice: (productData.variantGeneration.basePrice || 0) * 0.8,
//             },
//             inventory: {
//               stock: productData.variantGeneration.initialStock || 0,
//               lowStockThreshold: productData.variantGeneration.initialStock > 0 ? 5 : 0,
//               backorder: false,
//               trackInventory: true,
//             },
//             images: [],
//             isActive: true,
//             isPublished: true,
//           }));
//           productData.hasVariants = true;
//         }
//       }
//     }

//     // Set hasVariants if variants are provided manually
//     if (!productData.hasVariants && productData.variants?.length > 0) {
//       productData.hasVariants = true;
//     }

//     // Create the product
//     const product = new Product(productData);
//     await product.save();

//     // Handle collection assignment if provided
//     if (productData.collections && productData.collections.length > 0) {
//       await CollectionProduct.insertMany(
//         productData.collections.map(collectionId => ({
//           collection: collectionId,
//           product: product._id
//         }))
//         .catch(err => console.error("Collection assignment error:", err)));
//     }

//     res.status(201).json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// import Product from "../../models/productModel.js";
// // import CollectionProduct from "../../models/collectionProductModel.js";
// import { generateSlug } from "../../helpers/generateSlug.js";
// import { generateSKU } from "../../helpers/generateSKU.js";
// import { handleError } from "../../helpers/handleError.js";
// import { generateVariantCombinations,calculateVariantPrice, calculateVariantStock } from "../../helpers/variantHelper.js";
// import mongoose from "mongoose";

// export const createProduct = async (req, res) => {
//   try {
//     const productData = req.body;

//     // Validate required fields
//     if (!productData.name || !productData.category) {
//       throw new Error("Name and category are required");
//     }

//     // Generate slug if not provided
//     if (!productData.slug) {
//       productData.slug = generateSlug(productData.name);
//     }

//     // Calculate min/max prices if not provided
//     if (!productData.minPrice || !productData.maxPrice) {
//       productData.minPrice = productData.basePrice?.sellingPrice || 0;
//       productData.maxPrice = productData.basePrice?.sellingPrice || 0;
//     }

//     // Handle variant generation if needed
//     if (productData.variantAttributes?.length > 0) {
//       const attributes = await mongoose
//         .model("Attribute")
//         .find({
//           _id: { $in: productData.variantAttributes },
//           isVariantAttribute: true,
//         })
//         .lean();

//       if (attributes.length > 0) {
//         const attrValuePairs = attributes.map((attr) => ({
//           attribute: attr._id,
//           values: attr.values,
//           name: attr.name // Include attribute name for price rules
//         }));

//         const newCombinations = generateVariantCombinations(
//           attrValuePairs,
//           productData.variantGroupBy
//         );

//         if (productData.variantGeneration?.autoGenerate) {
//           productData.variants = await Promise.all(newCombinations.map(async (combo) => {
//             // Calculate variant price based on pricing strategy
//             const variantPrice = calculateVariantPrice(
//               productData.variantGeneration,
//               combo.attributes
//             );

//             // Calculate stock based on stock rules
//             const variantStock = calculateVariantStock(
//               productData.variantGeneration,
//               combo.attributes,
//               productData.variantGeneration.initialStock || 0
//             );

//             return {
//               attributes: combo.attributes,
//               variantGroup: combo.variantGroup,
//               sku: generateSKU(productData.name, combo.attributes),
//               price: {
//                 mrp: variantPrice.mrp,
//                 sellingPrice: variantPrice.sellingPrice,
//                 costPrice: variantPrice.costPrice || (variantPrice.sellingPrice * 0.8)
//               },
//               inventory: {
//                 stock: variantStock,
//                 lowStockThreshold: variantStock > 0 ?
//                   (productData.baseInventory?.lowStockThreshold || 5) : 0,
//                 backorder: productData.baseInventory?.backorder || false,
//                 trackInventory: productData.baseInventory?.trackInventory !== false
//               },
//               images: [],
//               isActive: true,
//               isPublished: true
//             };
//           }));

//           // Update min/max prices based on variants
//           if (productData.variants.length > 0) {
//             const prices = productData.variants.map(v => v.price.sellingPrice);
//             productData.minPrice = Math.min(...prices);
//             productData.maxPrice = Math.max(...prices);
//           }

//           productData.hasVariants = true;
//         }
//       }
//     }

//     // Set hasVariants if variants are provided manually
//     if (!productData.hasVariants && productData.variants?.length > 0) {
//       productData.hasVariants = true;
//       // Update min/max prices for manual variants
//       const prices = productData.variants.map(v => v.price.sellingPrice);
//       productData.minPrice = Math.min(...prices);
//       productData.maxPrice = Math.max(...prices);
//     }

//     // Create the product
//     const product = new Product(productData);
//     await product.save();

//     // Handle collection assignment if provided
//     // if (productData.collections && productData.collections.length > 0) {
//     //   await CollectionProduct.insertMany(
//     //     productData.collections.map(collectionId => ({
//     //       collection: collectionId,
//     //       product: product._id
//     //     }))
//     //     .catch(err => console.error("Collection assignment error:", err)));
//     // }

//     res.status(201).json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

import Product from "../../models/productModel.js";
import { generateSlug } from "../../helpers/generateSlug.js";
import { generateSKU } from "../../helpers/generateSKU.js";
import { handleError } from "../../helpers/handleError.js";
import {
  generateVariantCombinations,
  calculateVariantPrice,
  calculateVariantStock,
} from "../../helpers/variantHelper.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Validate required fields
    if (!productData.name || !productData.category) {
      throw new Error("Name and category are required");
    }

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Calculate min/max prices if not provided
    if (!productData.minPrice || !productData.maxPrice) {
      productData.minPrice = productData.basePrice?.sellingPrice || 0;
      productData.maxPrice = productData.basePrice?.sellingPrice || 0;
    }

    // Handle variant generation if needed
    if (productData.variantAttributes?.length > 0) {
      const attributes = await mongoose
        .model("Attribute")
        .find({
          _id: { $in: productData.variantAttributes },
          isVariantAttribute: true,
        })
        .lean();

      if (attributes.length > 0) {
        // Transform selectedAttributeValues from object to array format for DB storage
        if (productData.selectedAttributeValues) {
          productData.selectedAttributeValues = Object.entries(productData.selectedAttributeValues).map(
            ([attributeId, values]) => ({
              attribute: attributeId,
              values: values
            })
          );
        }

        // Validate selected values if provided
        if (productData.selectedAttributeValues) {
          for (const selectedAttr of productData.selectedAttributeValues) {
            const attribute = attributes.find(
              (a) => a._id.toString() === selectedAttr.attribute.toString()
            );
            if (!attribute) {
              throw new Error(`Attribute ${selectedAttr.attribute} not found`);
            }

            const invalidValues = selectedAttr.values.filter(
              (val) => !attribute.values.includes(val)
            );

            if (invalidValues.length > 0) {
              throw new Error(
                `Invalid values for attribute ${
                  attribute.name
                }: ${invalidValues.join(", ")}`
              );
            }
          }
        }

        const attrValuePairs = attributes.map((attr) => {
          // Find selected values for this attribute if they exist
          const selectedValues = productData.selectedAttributeValues?.find(
            (sa) => sa.attribute.toString() === attr._id.toString()
          );

          // Use selectedValues if provided, otherwise use all values
          const valuesToUse = selectedValues?.values || attr.values;

          if (!valuesToUse || valuesToUse.length === 0) {
            throw new Error(`No values selected for attribute ${attr.name}`);
          }

          return {
            attribute: attr._id,
            values: valuesToUse,
            name: attr.name,
          };
        });

        const newCombinations = generateVariantCombinations(
          attrValuePairs,
          productData.variantGroupBy
        );

        if (productData.variantGeneration?.autoGenerate) {
          productData.variants = await Promise.all(
            newCombinations.map(async (combo) => {
              // Calculate variant price based on pricing strategy
              const variantPrice = calculateVariantPrice(
                productData.variantGeneration,
                combo.attributes
              );

              // Calculate stock based on stock rules
              const variantStock = calculateVariantStock(
                productData.variantGeneration,
                combo.attributes,
                productData.variantGeneration.initialStock || 0
              );

              return {
                attributes: combo.attributes,
                variantGroup: combo.variantGroup,
                sku: generateSKU(productData.name, combo.attributes),
                price: {
                  mrp: variantPrice.mrp,
                  sellingPrice: variantPrice.sellingPrice,
                  costPrice:
                    variantPrice.costPrice || variantPrice.sellingPrice * 0.8,
                },
                inventory: {
                  stock: variantStock,
                  lowStockThreshold:
                    variantStock > 0
                      ? productData.baseInventory?.lowStockThreshold || 5
                      : 0,
                  backorder: productData.baseInventory?.backorder || false,
                  trackInventory:
                    productData.baseInventory?.trackInventory !== false,
                },
                images: [],
                isActive: true,
                isPublished: true,
              };
            })
          );

          // Update min/max prices based on variants
          if (productData.variants.length > 0) {
            const prices = productData.variants.map(
              (v) => v.price.sellingPrice
            );
            productData.minPrice = Math.min(...prices);
            productData.maxPrice = Math.max(...prices);
          }

          productData.hasVariants = true;
        }
      }
    }

    // Set hasVariants if variants are provided manually
    if (!productData.hasVariants && productData.variants?.length > 0) {
      productData.hasVariants = true;
      // Update min/max prices for manual variants
      const prices = productData.variants.map((v) => v.price.sellingPrice);
      productData.minPrice = Math.min(...prices);
      productData.maxPrice = Math.max(...prices);
    }

    // Create the product
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    handleError(res, error);
  }
};