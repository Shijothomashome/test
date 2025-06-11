import Product from "../../models/productModel.js";
import CollectionProduct from "../../models/collectionProductModel.js";
import { handleError } from "../../helpers/handleError.js";

//! Update product collections
// @desc    Update product collections
// @route   PUT /api/products/:productId/collections
// @access  Private (Admin or Editor)

// This endpoint allows admins or editors to manage the collections a product belongs to.
// It supports replacing, adding, or removing collections for a product.
// It expects an array of collection IDs in the request body and performs the specified action.
// The product's `collection_id` is updated to the first collection in the array if replacing collections.
// @param {Object} req - The request object containing the productId in params and collections in body.


export const updateProductCollections = async (req, res) => {
  try {
    const { productId } = req.params;
    const { collections, action = 'replace' } = req.body;

    if (!collections || !Array.isArray(collections)) {
      throw new Error("Collections array is required");
    }

    let result;
    const collectionProducts = collections.map(collectionId => ({
      collection: collectionId,
      product: productId
    }));

    if (action === 'replace') {
      // Remove all existing collection associations first
      await CollectionProduct.deleteMany({ product: productId });
      result = await CollectionProduct.insertMany(collectionProducts);
    } else if (action === 'add') {
      result = await CollectionProduct.insertMany(collectionProducts, { ordered: false });
    } else if (action === 'remove') {
      result = await CollectionProduct.deleteMany({ 
        product: productId, 
        collection: { $in: collections } 
      });
    }

    // Update product's collection_id if using single collection approach
    if (action === 'replace' && collections.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        collection_id: collections[0] // Set to first collection
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      message: `Collections ${action} successful`
    });
  } catch (error) {
    handleError(res, error);
  }
};