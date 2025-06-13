// import Collection from "../../models/collectionModel.js";
// import CollectionProduct from "../../models/collectionProductModel.js";
// import { handleError } from "../../helpers/handleError.js";

// // @desc    Update products in collection
// // @route   PUT /api/collections/:id/products
// export const updateCollectionProducts = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       throw new Error("Collection ID is required");
//     }
//     const { products, action = 'replace' } = req.body;

//     if (!products || !Array.isArray(products)) {
//       throw new Error("Products array is required");
//     }

//     const collection = await Collection.findById(id);

//     if (!collection) {
//       throw new Error("Collection not found", 404);
//     }

//     // Prevent manual updates for smart collections
//     if (collection.collection_type === 'smart') {
//       throw new Error("Cannot manually update products in smart collections");
//     }

//     let result;
//     const collectionProducts = products.map(productId => ({
//       collection: id,
//       product: productId
//     }));

//     if (action === 'replace') {
//       // Remove all existing product associations first
//       await CollectionProduct.deleteMany({ collection: id });
//       result = await CollectionProduct.insertMany(collectionProducts);
//     } else if (action === 'add') {
//       result = await CollectionProduct.insertMany(collectionProducts, { 
//         ordered: false 
//       });
//     } else if (action === 'remove') {
//       result = await CollectionProduct.deleteMany({ 
//         collection: id, 
//         product: { $in: products } 
//       });
//     }

//     // Update products count
//     await collection.updateProductsCount();

//     res.status(200).json({
//       success: true,
//       data: result,
//       message: `Products ${action} successful`
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };


import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

export const updateCollectionProducts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Collection ID is required");
    }
    const { products, action = 'replace' } = req.body;

    if (!products || !Array.isArray(products)) {
      throw new Error("Products array is required");
    }

    const collection = await Collection.findById(id);

    if (!collection) {
      throw new Error("Collection not found", 404);
    }

    // Prevent manual updates for smart collections
    if (collection.collection_type === 'smart') {
      throw new Error("Cannot manually update products in smart collections");
    }

    if (action === 'replace') {
      // Remove this collection from all products first
      await Product.updateMany(
        { collection_id: id },
        { $unset: { collection_id: 1 } }
      );
      
      // Set this collection for all specified products
      await Product.updateMany(
        { _id: { $in: products } },
        { collection_id: id }
      );
    } 
    else if (action === 'add') {
      // Add this collection to specified products
      await Product.updateMany(
        { _id: { $in: products } },
        { collection_id: id }
      );
    } 
    else if (action === 'remove') {
      // Remove this collection from specified products
      await Product.updateMany(
        { 
          _id: { $in: products },
          collection_id: id
        },
        { $unset: { collection_id: 1 } }
      );
    }

    res.status(200).json({
      success: true,
      message: `Products ${action} successful`
    });
  } catch (error) {
    handleError(res, error);
  }
};