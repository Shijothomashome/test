// services/collectionQueue.js

import Collection from "../models/collectionModel.js";
import Product from "../models/productModel.js";
import { getMatchingProductsForSmartCollection } from "../controllers/collection/smartCollections.js";

/**
 * Schedules background update of smart collection products
 * @param {string} collectionId - Collection ID
 */
export const scheduleSmartCollectionUpdate = async (collectionId) => {
  await queue.add('update-smart-collection', { collectionId }, {
    jobId: `smart-collection-update-${collectionId}`,
    removeOnComplete: true,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
};

/**
 * Background job processor for updating smart collections
 */
export const processSmartCollectionUpdate = async (job) => {
  const { collectionId } = job.data;
  const collection = await Collection.findById(collectionId);
  
  if (!collection || collection.collection_type !== 'smart') return;
  
  try {
    // Get current matching products
    const matchingProducts = await getMatchingProductsForSmartCollection(collection);
    const matchingProductIds = matchingProducts.map(p => p._id);
    
    // Add collection to matching products
    await Product.updateMany(
      { _id: { $in: matchingProductIds } },
      { $set: { collection_id: collectionId } }
    );
    
    // Remove collection from non-matching products
    await Product.updateMany(
      { 
        collection_id: collectionId,
        _id: { $nin: matchingProductIds }
      },
      { $unset: { collection_id: "" } }
    );
    
    // Update product count
    collection.products_count = matchingProductIds.length;
    await collection.save();
    
    // Clear cache
    await cache.del(`collection:products:${collectionId}`);
  } catch (error) {
    console.error(`Failed to update smart collection ${collectionId}:`, error);
    throw error;
  }
};

/**
 * Ensures proper indexes exist for smart collection performance
 */
export const ensureSmartCollectionIndexes = async () => {
  await Product.collection.createIndex({ tags: 1 });
  await Product.collection.createIndex({ 'price.sellingPrice': 1 });
  await Product.collection.createIndex({ productType: 1 });
  await Product.collection.createIndex({ vendor: 1 });
  await Product.collection.createIndex({ 'inventory.stock': 1 });
  await Product.collection.createIndex({ weight: 1 });
  await Product.collection.createIndex({ 'variants.title': 1 });
};