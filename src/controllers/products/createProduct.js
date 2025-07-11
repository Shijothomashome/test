//! This file handles the creation of a product in the e-commerce system.
//! in this file , products id will save to collection products model
//! This is the main controller for creating products, handling variants, and managing collections.


// import Product from "../../models/productModel.js";
// import { generateSlug } from "../../helpers/generateSlug.js";
// import { generateSKU } from "../../helpers/generateSKU.js";
// import { handleError } from "../../helpers/handleError.js";
// import {
//   generateVariantCombinations,
//   calculateVariantPrice,
//   calculateVariantStock,
// } from "../../helpers/variantHelper.js";
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
//         // Transform selectedAttributeValues from object to array format for DB storage
//         if (productData.selectedAttributeValues) {
//           productData.selectedAttributeValues = Object.entries(productData.selectedAttributeValues).map(
//             ([attributeId, values]) => ({
//               attribute: attributeId,
//               values: values
//             })
//           );
//         }

//         // Validate selected values if provided
//         if (productData.selectedAttributeValues) {
//           for (const selectedAttr of productData.selectedAttributeValues) {
//             const attribute = attributes.find(
//               (a) => a._id.toString() === selectedAttr.attribute.toString()
//             );
//             if (!attribute) {
//               throw new Error(`Attribute ${selectedAttr.attribute} not found`);
//             }

//             const invalidValues = selectedAttr.values.filter(
//               (val) => !attribute.values.includes(val)
//             );

//             if (invalidValues.length > 0) {
//               throw new Error(
//                 `Invalid values for attribute ${
//                   attribute.name
//                 }: ${invalidValues.join(", ")}`
//               );
//             }
//           }
//         }

//         const attrValuePairs = attributes.map((attr) => {
//           // Find selected values for this attribute if they exist
//           const selectedValues = productData.selectedAttributeValues?.find(
//             (sa) => sa.attribute.toString() === attr._id.toString()
//           );

//           // Use selectedValues if provided, otherwise use all values
//           const valuesToUse = selectedValues?.values || attr.values;

//           if (!valuesToUse || valuesToUse.length === 0) {
//             throw new Error(`No values selected for attribute ${attr.name}`);
//           }

//           return {
//             attribute: attr._id,
//             values: valuesToUse,
//             name: attr.name,
//           };
//         });

//         const newCombinations = generateVariantCombinations(
//           attrValuePairs,
//           productData.variantGroupBy
//         );

//         if (productData.variantGeneration?.autoGenerate) {
//           productData.variants = await Promise.all(
//             newCombinations.map(async (combo) => {
//               // Calculate variant price based on pricing strategy
//               const variantPrice = calculateVariantPrice(
//                 productData.variantGeneration,
//                 combo.attributes
//               );

//               // Calculate stock based on stock rules
//               const variantStock = calculateVariantStock(
//                 productData.variantGeneration,
//                 combo.attributes,
//                 productData.variantGeneration.initialStock || 0
//               );

//               return {
//                 attributes: combo.attributes,
//                 variantGroup: combo.variantGroup,
//                 sku: generateSKU(productData.name, combo.attributes),
//                 price: {
//                   mrp: variantPrice.mrp,
//                   sellingPrice: variantPrice.sellingPrice,
//                   costPrice:
//                     variantPrice.costPrice || variantPrice.sellingPrice * 0.8,
//                 },
//                 inventory: {
//                   stock: variantStock,
//                   lowStockThreshold:
//                     variantStock > 0
//                       ? productData.baseInventory?.lowStockThreshold || 5
//                       : 0,
//                   backorder: productData.baseInventory?.backorder || false,
//                   trackInventory:
//                     productData.baseInventory?.trackInventory !== false,
//                 },
//                 images: [],
//                 isActive: true,
//                 isPublished: true,
//               };
//             })
//           );

//           // Update min/max prices based on variants
//           if (productData.variants.length > 0) {
//             const prices = productData.variants.map(
//               (v) => v.price.sellingPrice
//             );
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
//       const prices = productData.variants.map((v) => v.price.sellingPrice);
//       productData.minPrice = Math.min(...prices);
//       productData.maxPrice = Math.max(...prices);
//     }

//     // Create the product
//     const product = new Product(productData);
//     await product.save();

//     res.status(201).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };
import Product from "../../models/productModel.js";
import Collection from "../../models/collectionModel.js";
import { generateSlug } from "../../helpers/generateSlug.js";
import { generateSKU } from "../../helpers/generateSKU.js";
import { handleError } from "../../helpers/handleError.js";
import {
  generateVariantCombinations,
  calculateVariantPrice,
  calculateVariantStock,
} from "../../helpers/variantHelper.js";
import mongoose from "mongoose";

/**
 * Updates collections with new product information
 */
const updateProductCollections = async (collectionIds, productId) => {
  if (!collectionIds || collectionIds.length === 0) return;
  
  await Collection.updateMany(
    { _id: { $in: collectionIds } },
    { $addToSet: { products: productId } }
  );
  
  const collections = await Collection.find({ _id: { $in: collectionIds } });
  await Promise.all(collections.map(collection => collection.updateProductsCount()));
};

/**
 * Validates collection IDs exist and are active
 */
const validateCollections = async (collectionIds) => {
  if (!collectionIds || collectionIds.length === 0) return;
  
  const collections = await Collection.find({
    _id: { $in: collectionIds },
    status: 'active'
  });
  
  if (collections.length !== collectionIds.length) {
    const foundIds = collections.map(c => c._id.toString());
    const missingIds = collectionIds.filter(id => !foundIds.includes(id.toString()));
    throw new Error(`Invalid or inactive collections: ${missingIds.join(', ')}`);
  }
};

/**
 * Processes rich description content before saving
 */
const processRichDescription = (richDescription) => {
  if (!richDescription || !Array.isArray(richDescription)) return [];

  return richDescription.map((block, index) => {
    // Ensure each block has an order
    if (typeof block.order !== 'number') {
      block.order = index;
    }

    // Normalize content based on type
    switch(block.type) {
      case 'list':
        if (!Array.isArray(block.content)) {
          block.content = [block.content];
        }
        break;
      case 'image':
        if (typeof block.content !== 'string') {
          throw new Error('Image block content must be a URL string');
        }
        break;
      case 'table':
        if (!Array.isArray(block.content)) {
          throw new Error('Table content must be an array of rows');
        }
        break;
    }

    return block;
  }).sort((a, b) => a.order - b.order);
};

/**
 * Calculates total stock from all variants
 */
const calculateTotalVariantStock = (variants = []) => {
  return variants.reduce((total, variant) => {
    return total + (variant.inventory?.stock || 0);
  }, 0);
};

export const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const productData = req.body;

    // Validate required fields
    if (!productData.name || !productData.category) {
      throw new Error("Name and category are required");
    }

    // Validate collections if provided
    if (productData.collection_ids) {
      await validateCollections(productData.collection_ids);
    }

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Process rich description if provided
    if (productData.richDescription) {
      productData.richDescription = processRichDescription(productData.richDescription);
    }

    // Initialize base inventory if not provided
    productData.baseInventory = productData.baseInventory || {
      stock: 0,
      lowStockThreshold: 5,
      backorder: false,
      trackInventory: true
    };

    // Handle variant generation if needed
    if (productData.variantAttributes?.length > 0) {
      const attributes = await mongoose
        .model("Attribute")
        .find({
          _id: { $in: productData.variantAttributes },
          isVariantAttribute: true,
        })
        .lean()
        .session(session);

      if (attributes.length > 0) {
        if (productData.selectedAttributeValues) {
          productData.selectedAttributeValues = Object.entries(productData.selectedAttributeValues).map(
            ([attributeId, values]) => ({
              attribute: attributeId,
              values: values
            })
          );
        }

        // Validate selected attribute values
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
          const selectedValues = productData.selectedAttributeValues?.find(
            (sa) => sa.attribute.toString() === attr._id.toString()
          );
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
              const variantPrice = calculateVariantPrice(
                productData.variantGeneration,
                combo.attributes
              );

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

          // Update pricing and stock information
          if (productData.variants.length > 0) {
            const prices = productData.variants.map(
              (v) => v.price.sellingPrice
            );
            productData.minPrice = Math.min(...prices);
            productData.maxPrice = Math.max(...prices);
            
            // Update base inventory with total variant stock
            productData.baseInventory.stock = calculateTotalVariantStock(productData.variants);
          }

          productData.hasVariants = true;
        }
      }
    }

    // For non-variant products or manually added variants
    if (!productData.hasVariants && productData.variants?.length > 0) {
      productData.hasVariants = true;
      const prices = productData.variants.map((v) => v.price.sellingPrice);
      productData.minPrice = Math.min(...prices);
      productData.maxPrice = Math.max(...prices);
      
      // Update base inventory with total variant stock
      productData.baseInventory.stock = calculateTotalVariantStock(productData.variants);
    }

    // Set default values if not provided
    if (!productData.minPrice) {
      productData.minPrice = productData.basePrice?.sellingPrice || 0;
    }
    if (!productData.maxPrice) {
      productData.maxPrice = productData.basePrice?.sellingPrice || 0;
    }

    // Create the product
    const product = new Product(productData);
    await product.save({ session });

    // Update collections with this product
    if (productData.collection_ids) {
      await updateProductCollections(productData.collection_ids, product._id);
    }

    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    await session.abortTransaction();
    handleError(res, error);
  } finally {
    session.endSession();
  }
};