import { generateSlug } from "../../helpers/generateSlug.js";
import { handleError } from "../../helpers/handleError.js";
import Collection from "../../models/collectionModel.js";
// import CollectionProduct from "../../models/collectionProductModel";


// @desc    Create a new collection
// @route   POST /api/collections
export const createCollection = async (req, res) => {
  try {
    const collectionData = req.body;

    if (!collectionData.title) {
      throw new Error("Title is required");
    }

    if (!collectionData.handle) {
      collectionData.handle = generateSlug(collectionData.title);
    }

    if (collectionData.collection_type === 'smart' && 
        (!collectionData.rules || collectionData.rules.length === 0)) {
      throw new Error("Smart collections require rules");
    }

    const collection = new Collection(collectionData);
    await collection.save();

    res.status(201).json({
      success: true,
      data: collection
    });
  } catch (error) {
    handleError(res, error);
  }
};