import Collection from "../../models/collectionModel.js";
import { handleError } from "../../helpers/handleError.js";
import { generateSlug } from "../../helpers/generateSlug.js";
//
// @desc    Update collection
// @route   PUT /api/collections/:id
export const updateCollection = async (req, res) => {
  try {
    const { 
      title, 
      handle,
      description, 
      description_html,
      image, 
      seo, 
      status, 
      rules,
      disjunctive,
      sort_order,
      template_suffix,
      metafields,
      visibility,
      collection_type
    } = req.body;
    
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      throw new Error("Collection not found", 404);
    }

    // Update basic fields
    collection.title = title || collection.title;
    collection.description = description || collection.description;
    collection.description_html = description_html || collection.description_html;
    collection.image = image || collection.image;
    collection.seo = seo || collection.seo;
    collection.status = status || collection.status;
    collection.disjunctive = disjunctive !== undefined ? disjunctive : collection.disjunctive;
    collection.sort_order = sort_order || collection.sort_order;
    collection.template_suffix = template_suffix || collection.template_suffix;
    collection.metafields = metafields || collection.metafields;
    collection.visibility = visibility || collection.visibility;
    collection.collection_type = collection_type || collection.collection_type;

    // Handle slug generation
    if (title && !handle) {
      collection.handle = generateSlug(title);
    } else if (handle) {
      collection.handle = handle;
    }

    // Handle rules for smart collections
    if (collection.collection_type === 'smart') {
      if (rules && rules.length > 0) {
        collection.rules = rules;
      } else if (rules === undefined) {
        // Keep existing rules
      } else {
        throw new Error("Smart collections require rules");
      }
    } else if (collection.collection_type === 'custom' && rules !== undefined) {
      // Clear rules if changing from smart to custom
      collection.rules = [];
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