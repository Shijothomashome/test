// import Collection from "../../models/collectionModel.js";
// import CollectionProduct from "../../models/collectionProductModel.js";
// import { generateSlug } from "../../helpers/generateSlug.js";
// import { handleError } from "../../helpers/handleError.js";

// // @desc    Delete collection
// // @route   DELETE /api/collections/:id
// export const deleteCollection = async (req, res) => {
//   try {
//     const collection = await Collection.findById(req.params.id);

//     if (!collection) {
//       throw new Error("Collection not found", 404);
//     }

//     // Remove all product associations
//     await CollectionProduct.deleteMany({ collection: collection._id });
//     await collection.remove();

//     res.status(200).json({
//       success: true,
//       message: "Collection deleted successfully"
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };


import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      throw new Error("Collection not found", 404);
    }

    // Remove collection reference from all products
    await Product.updateMany(
      { collection_id: collection._id },
      { $unset: { collection_id: 1 } }
    );

    await collection.remove();

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully"
    });
  } catch (error) {
    handleError(res, error);
  }
};