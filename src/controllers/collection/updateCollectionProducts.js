import Collection from "../../models/collectionModel.js";
import CollectionProduct from "../../models/collectionProductModel.js";
import { handleError } from "../../helpers/handleError.js";

// @desc    Update products in collection
// @route   PUT /api/collections/:id/products
export const updateCollectionProducts = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { products, action = 'replace' } = req.body;

    if (!products || !Array.isArray(products)) {
      throw new Error("Products array is required");
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      throw new Error("Collection not found", 404);
    }

    // Prevent manual updates for smart collections
    if (collection.collection_type === 'smart') {
      throw new Error("Cannot manually update products in smart collections");
    }

    let result;
    const collectionProducts = products.map(productId => ({
      collection: collectionId,
      product: productId
    }));

    if (action === 'replace') {
      // Remove all existing product associations first
      await CollectionProduct.deleteMany({ collection: collectionId });
      result = await CollectionProduct.insertMany(collectionProducts);
    } else if (action === 'add') {
      result = await CollectionProduct.insertMany(collectionProducts, { 
        ordered: false 
      });
    } else if (action === 'remove') {
      result = await CollectionProduct.deleteMany({ 
        collection: collectionId, 
        product: { $in: products } 
      });
    }

    // Update products count
    await collection.updateProductsCount();

    res.status(200).json({
      success: true,
      data: result,
      message: `Products ${action} successful`
    });
  } catch (error) {
    handleError(res, error);
  }
};