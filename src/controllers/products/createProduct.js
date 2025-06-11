import Product from "../../models/productModel.js";
import CollectionProduct from "../../models/collectionProductModel.js";
import { generateSlug } from "../../helpers/generateSlug.js";
import { generateSKU } from "../../helpers/generateSKU.js";
import { handleError } from "../../helpers/handleError.js";

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

    // Set hasVariants based on whether variants are provided
    productData.hasVariants = productData.variants?.length > 0;

    // If variants are provided, generate SKUs if not present
    if (productData.hasVariants) {
      productData.variants = productData.variants.map(variant => {
        if (!variant.sku) {
          return {
            ...variant,
            sku: generateSKU(productData.name, variant.attributes)
          };
        }
        return variant;
      });
    }

    // Create the product
    const product = new Product(productData);
    await product.save();

    // Handle collection assignment if provided
    if (productData.collections && productData.collections.length > 0) {
      await CollectionProduct.insertMany(
        productData.collections.map(collectionId => ({
          collection: collectionId,
          product: product._id
        }))
        .catch(err => console.error("Collection assignment error:", err)));
    }

    res.status(201).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    handleError(res, error);
  }
};