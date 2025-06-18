import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";
import Collection from "../../models/collectionModel.js";

//! Update a product
//* @desc    Update a product by ID
//* @route   PUT /api/v1/products/:id
//* @access  Private (Admin)

// This endpoint allows admins to update an existing product by its ID.
// It validates the input, updates the product, and returns the updated product data.
// Note: Ensure that the Product model has the necessary fields and validations defined.
// This endpoint also supports updating product variants, attributes, and categories.

export const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate product exists
    const product = await Product.findById(id).session(session);
    if (!product) {
      throw new Error('Product not found');
    }

    // Store old values for comparison
    const oldCollectionIds = product.collection_ids || [];
    const oldVariantAttributes = product.variantAttributes || [];
    const oldHasVariants = product.hasVariants;

    // Validate collections if being updated
    if (updateData.collection_ids) {
      const collections = await Collection.find({
        _id: { $in: updateData.collection_ids },
        status: 'active'
      }).session(session);
      
      if (collections.length !== updateData.collection_ids.length) {
        const foundIds = collections.map(c => c._id.toString());
        const missingIds = updateData.collection_ids.filter(id => !foundIds.includes(id.toString()));
        throw new Error(`Invalid or inactive collections: ${missingIds.join(', ')}`);
      }
    }

    // Handle slug update if name changed
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    }

    // Handle variant generation if variantAttributes changed
    if (updateData.variantAttributes && 
        JSON.stringify(updateData.variantAttributes) !== JSON.stringify(oldVariantAttributes)) {
      
      // ... (keep your existing variant generation logic) ...
    }

    // Apply updates
    Object.keys(updateData).forEach(key => {
      product[key] = updateData[key];
    });

    // Save the product
    const updatedProduct = await product.save({ session });

    // Sync collections if they changed
    if (updateData.collection_ids || 
        (oldHasVariants !== updatedProduct.hasVariants && oldCollectionIds.length > 0)) {
      await syncProductCollections(
        product._id,
        updatedProduct.collection_ids || [],
        oldCollectionIds,
        session
      );
    }

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    await session.abortTransaction();
    handleError(res, error);
  } finally {
    session.endSession();
  }
};

// Collection synchronization helper
const syncProductCollections = async (productId, newCollectionIds = [], oldCollectionIds = [], session = null) => {
  const options = session ? { session } : {};
  
  const newIds = newCollectionIds.map(id => id.toString());
  const oldIds = oldCollectionIds.map(id => id.toString());
  
  const collectionsToAdd = newIds.filter(id => !oldIds.includes(id));
  const collectionsToRemove = oldIds.filter(id => !newIds.includes(id));
  
  // Add to new collections
  if (collectionsToAdd.length > 0) {
    await Collection.updateMany(
      { _id: { $in: collectionsToAdd } },
      { $addToSet: { products: productId } },
      options
    );
  }
  
  // Remove from old collections
  if (collectionsToRemove.length > 0) {
    await Collection.updateMany(
      { _id: { $in: collectionsToRemove } },
      { $pull: { products: productId } },
      options
    );
  }
  
  // Update counts for all affected collections
  const affectedCollections = [...collectionsToAdd, ...collectionsToRemove];
  if (affectedCollections.length > 0) {
    await updateCollectionsProductCount(affectedCollections, options);
  }
};

// Helper to update product counts for multiple collections
const updateCollectionsProductCount = async (collectionIds, options = {}) => {
  const collections = await Collection.find({ _id: { $in: collectionIds } }, null, options);
  
  await Promise.all(collections.map(async (collection) => {
    const count = await Product.countDocuments(
      { collection_ids: collection._id },
      options
    );
    collection.products_count = count;
    await collection.save(options);
  }));
};