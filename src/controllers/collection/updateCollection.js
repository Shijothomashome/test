import Collection from "../../models/collectionModel.js";
import { handleError } from "../../helpers/handleError.js";
import { generateSlug } from "../../helpers/generateSlug.js";

// @desc    Update collection
// @route   PUT /api/collections/:id
export const updateCollection = async (req, res) => {
  try {
    const { title, description, image, seo, status, rules } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      throw new Error("Collection not found", 404);
    }

    collection.title = title || collection.title;
    collection.description = description || collection.description;
    collection.image = image || collection.image;
    collection.seo = seo || collection.seo;
    collection.status = status || collection.status;

    if (title && !req.body.handle) {
      collection.handle = generateSlug(title);
    } else if (req.body.handle) {
      collection.handle = req.body.handle;
    }

    if (collection.collection_type === 'smart') {
      if (rules && rules.length > 0) {
        collection.rules = rules;
      } else if (rules === undefined) {
        // Keep existing rules
      } else {
        throw new Error("Smart collections require rules");
      }
    }

    const updatedCollection = await collection.save();

    res.status(200).json({
      success: true,
      data: updatedCollection
    });
  } catch (error) {
    handleError(res, error);
  }
};