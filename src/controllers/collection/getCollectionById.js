import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).lean();

    if (!collection) {
      throw new Error("Collection not found", 404);
    }

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