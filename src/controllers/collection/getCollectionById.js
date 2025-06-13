// import Collection from "../../models/collectionModel.js";
// import CollectionProduct from "../../models/collectionProductModel.js";
// import { generateSlug } from "../../helpers/generateSlug.js";
// import { handleError } from "../../helpers/handleError.js";

// // @desc    Get single collection by ID
// // @route   GET /api/collections/:id
// export const getCollectionById = async (req, res) => {
//   try {
//     const collection = await Collection.findById(req.params.id).lean();

//     if (!collection) {
//       throw new Error("Collection not found", 404);
//     }

//     // Get products count
//     const products_count = await CollectionProduct.countDocuments({
//       collection: collection._id
//     });

//     res.status(200).json({
//       success: true,
//       data: { ...collection, products_count }
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };


import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).lean();

    if (!collection) {
      throw new Error("Collection not found", 404);
    }

    // Get products count
    const products_count = await Product.countDocuments({
      collection_id: collection._id,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      data: { ...collection, products_count }
    });
  } catch (error) {
    handleError(res, error);
  }
};