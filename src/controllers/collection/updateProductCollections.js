// import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel.js";
// import { handleError } from "../../helpers/handleError.js";

// //! Update product collections
// // @desc    Update product collections
// // @route   PUT /api/products/:productId/collections
// // @access  Private (Admin or Editor)

// // This endpoint allows admins or editors to manage the collections a product belongs to.
// // It supports replacing, adding, or removing collections for a product.
// // It expects an array of collection IDs in the request body and performs the specified action.
// // The product's `collection_id` is updated to the first collection in the array if replacing collections.
// // @param {Object} req - The request object containing the productId in params and collections in body.


// export const updateProductCollections = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { collections, action = 'replace' } = req.body;

//     if (!collections || !Array.isArray(collections)) {
//       throw new Error("Collections array is required");
//     }

//     let result;
//     const collectionProducts = collections.map(collectionId => ({
//       collection: collectionId,
//       product: productId
//     }));

//     if (action === 'replace') {
//       // Remove all existing collection associations first
//       await CollectionProduct.deleteMany({ product: productId });
//       result = await CollectionProduct.insertMany(collectionProducts);
//     } else if (action === 'add') {
//       result = await CollectionProduct.insertMany(collectionProducts, { ordered: false });
//     } else if (action === 'remove') {
//       result = await CollectionProduct.deleteMany({ 
//         product: productId, 
//         collection: { $in: collections } 
//       });
//     }

//     // Update product's collection_id if using single collection approach
//     if (action === 'replace' && collections.length > 0) {
//       await Product.findByIdAndUpdate(productId, {
//         collection_id: collections[0] // Set to first collection
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: result,
//       message: `Collections ${action} successful`
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };


import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

export const updateProductCollections = async (req, res) => {
  try {
    const { productId } = req.params;
    const { collectionId, action = 'set' } = req.body;

    if (!collectionId) {
      throw new Error("Collection ID is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found", 404);
    }

    if (action === 'set') {
      product.collection_id = collectionId;
    } 
    else if (action === 'remove') {
      if (product.collection_id && product.collection_id.equals(collectionId)) {
        product.collection_id = undefined;
      } else {
        throw new Error("Product is not in the specified collection");
      }
    } 
    else {
      throw new Error("Invalid action. Use 'set' or 'remove'");
    }

    await product.save();

    // Update products count for both collections if needed
    if (action === 'set' && product.collection_id) {
      const oldCollection = await Collection.findById(product.collection_id);
      if (oldCollection) await oldCollection.updateProductsCount();
    }
    
    if (collectionId) {
      const newCollection = await Collection.findById(collectionId);
      if (newCollection) await newCollection.updateProductsCount();
    }

    res.status(200).json({
      success: true,
      message: `Collection ${action} successful`,
      data: product
    });
  } catch (error) {
    handleError(res, error);
  }
};