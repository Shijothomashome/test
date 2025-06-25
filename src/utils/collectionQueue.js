// // services/collectionQueue.js

// import Collection from "../models/collectionModel.js";
// import Product from "../models/productModel.js";
// import { getMatchingProductsForSmartCollection } from "../controllers/collection/smartCollections.js";

// /**
//  * Schedules background update of smart collection products
//  * @param {string} collectionId - Collection ID
//  */
// export const scheduleSmartCollectionUpdate = async (collectionId) => {
//   await queue.add('update-smart-collection', { collectionId }, {
//     jobId: `smart-collection-update-${collectionId}`,
//     removeOnComplete: true,
//     attempts: 3,
//     backoff: {
//       type: 'exponential',
//       delay: 5000
//     }
//   });
// };

// /**
//  * Background job processor for updating smart collections
//  */
// export const processSmartCollectionUpdate = async (job) => {
//   const { collectionId } = job.data;
//   const collection = await Collection.findById(collectionId);
  
//   if (!collection || collection.collection_type !== 'smart') return;
  
//   try {
//     // Get current matching products
//     const matchingProducts = await getMatchingProductsForSmartCollection(collection);
//     const matchingProductIds = matchingProducts.map(p => p._id);
    
//     // Add collection to matching products
//     await Product.updateMany(
//       { _id: { $in: matchingProductIds } },
//       { $set: { collection_id: collectionId } }
//     );
    
//     // Remove collection from non-matching products
//     await Product.updateMany(
//       { 
//         collection_id: collectionId,
//         _id: { $nin: matchingProductIds }
//       },
//       { $unset: { collection_id: "" } }
//     );
    
//     // Update product count
//     collection.products_count = matchingProductIds.length;
//     await collection.save();
    
//     // Clear cache
//     await cache.del(`collection:products:${collectionId}`);
//   } catch (error) {
//     console.error(`Failed to update smart collection ${collectionId}:`, error);
//     throw error;
//   }
// };

// /**
//  * Ensures proper indexes exist for smart collection performance
//  */
// export const ensureSmartCollectionIndexes = async () => {
//   await Product.collection.createIndex({ tags: 1 });
//   await Product.collection.createIndex({ 'price.sellingPrice': 1 });
//   await Product.collection.createIndex({ productType: 1 });
//   await Product.collection.createIndex({ vendor: 1 });
//   await Product.collection.createIndex({ 'inventory.stock': 1 });
//   await Product.collection.createIndex({ weight: 1 });
//   await Product.collection.createIndex({ 'variants.title': 1 });
// };



import Collection from "../models/collectionModel.js";
import Product from "../models/productModel.js";
import cache from "../config/cache.js";
import {queue} from "../config/queue.js";
import { buildSmartCollectionQuery, getMatchingProductsForSmartCollection } from "../controllers/collection/smartCollections.js";

/**
 * Schedules a background job to update a smart collection
 * @param {string} collectionId - The ID of the collection to update
 */
export const scheduleSmartCollectionUpdate = async (collectionId) => {
  try {
    await queue.add('update-smart-collection', { collectionId }, {
      jobId: `smart-collection-update-${collectionId}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });
  } catch (error) {
    console.error(`Failed to schedule update for collection ${collectionId}:`, error);
  }
};

/**
 * Processes a smart collection update job
 * @param {Object} job - The queue job containing collection data
 */
export const processSmartCollectionUpdate = async (job) => {
  const { collectionId } = job.data;
  
  try {
    const collection = await Collection.findById(collectionId);
    if (!collection || collection.collection_type !== 'smart') return;

    const matchingProducts = await getMatchingProductsForSmartCollection(collection);
    const matchingProductIds = matchingProducts.map(p => p._id);
    
    // Update products that now belong to this collection
    if (matchingProductIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: matchingProductIds } },
        { $set: { collection_id: collectionId } }
      );
    }
    
    // Remove collection from products that no longer match
    await Product.updateMany(
      { 
        collection_id: collectionId,
        _id: { $nin: matchingProductIds }
      },
      { $unset: { collection_id: "" } }
    );
    
    // Update collection's product count
    collection.products_count = matchingProductIds.length;
    await collection.save();
    
    // Clear cached products for this collection
    await cache.del(`collection:products:${collectionId}`);
    
    console.log(`Successfully updated smart collection ${collection.title} (${collectionId}) with ${matchingProductIds.length} products`);
  } catch (error) {
    console.error(`Failed to update smart collection ${collectionId}:`, error);
    throw error;
  }
};

/**
 * Ensures proper indexes exist for smart collection performance
 */
export const ensureSmartCollectionIndexes = async () => {
  try {
    await Product.collection.createIndex({ tags: 1 });
    await Product.collection.createIndex({ 'price.sellingPrice': 1 });
    await Product.collection.createIndex({ productType: 1 });
    await Product.collection.createIndex({ vendor: 1 });
    await Product.collection.createIndex({ 'inventory.stock': 1 });
    await Product.collection.createIndex({ weight: 1 });
    await Product.collection.createIndex({ 'variants.title': 1 });
    console.log('Smart collection indexes verified/created');
  } catch (error) {
    console.error('Failed to ensure smart collection indexes:', error);
    throw error;
  }
};

/**
 * Watches for product changes and triggers smart collection updates
 */
export const setupProductChangeWatchers = async () => {
  try {
    const changeStream = Product.watch([], { fullDocument: 'updateLookup' });
    
    changeStream.on('change', async (change) => {
      try {
        if (['insert', 'update', 'replace'].includes(change.operationType)) {
          await handleProductChange(change.fullDocument);
        }
      } catch (error) {
        console.error('Error processing change stream event:', error);
      }
    });
    
    changeStream.on('error', (error) => {
      console.error('Change stream error:', error);
      // Implement reconnection logic here if needed
    });
    
    console.log('Product change watcher initialized');
  } catch (error) {
    console.error('Failed to setup product change watcher:', error);
    throw error;
  }
};

/**
 * Handles product changes and updates relevant smart collections
 * @param {Object} product - The product document that changed
 */
export const handleProductChange = async (product) => {
  try {
    if (!product || !product._id) return;

    const smartCollections = await Collection.find({ 
      collection_type: 'smart',
      status: 'active'
    }).lean();
    
    if (smartCollections.length === 0) return;

    const updatePromises = smartCollections.map(async (collection) => {
      const query = buildSmartCollectionQuery(collection.rules, collection.disjunctive);
      const matches = await Product.countDocuments({
        _id: product._id,
        ...query
      });
      
      const currentCollection = product.collection_id?.equals(collection._id);
      
      if (matches && !currentCollection) {
        // Product now matches this collection
        await Product.updateOne(
          { _id: product._id },
          { $set: { collection_id: collection._id } }
        );
        return collection._id;
      } else if (!matches && currentCollection) {
        // Product no longer matches this collection
        await Product.updateOne(
          { _id: product._id },
          { $unset: { collection_id: 1 } }
        );
        return collection._id;
      }
      return null;
    });

    const collectionIdsToUpdate = (await Promise.all(updatePromises))
      .filter(id => id !== null);
    
    // Schedule updates for affected collections
    await Promise.all(
      collectionIdsToUpdate.map(id => scheduleSmartCollectionUpdate(id))
    );

  } catch (error) {
    console.error('Error handling product change:', error);
  }
};

/**
 * Periodic sync to ensure data consistency
 */
export const startPeriodicSmartCollectionSync = () => {
  // Run every 6 hours
  const interval = setInterval(async () => {
    try {
      console.log('Running periodic smart collection sync...');
      const collections = await Collection.find({
        collection_type: 'smart',
        status: 'active'
      }).lean();
      
      await Promise.all(
        collections.map(c => scheduleSmartCollectionUpdate(c._id))
      );
      
      console.log(`Periodic sync completed for ${collections.length} collections`);
    } catch (error) {
      console.error('Periodic sync failed:', error);
    }
  }, 6 * 60 * 60 * 1000); // 6 hours

  // Return the interval for potential cleanup
  return interval;
};

/**
 * Initializes the smart collection system
 */
export const initSmartCollections = async () => {
  try {
    console.log('Initializing smart collections system...');
    
    // 1. Ensure we have proper indexes
    await ensureSmartCollectionIndexes();
    
    // 2. Set up real-time product change watchers
    await setupProductChangeWatchers();
    
    // 3. Start periodic sync
    startPeriodicSmartCollectionSync();
    
    // 4. Schedule initial updates for all active smart collections
    const smartCollections = await Collection.find({ 
      collection_type: 'smart',
      status: 'active'
    }).lean();
    
    console.log(`Scheduling initial updates for ${smartCollections.length} smart collections`);
    
    await Promise.all(
      smartCollections.map(c => scheduleSmartCollectionUpdate(c._id))
    );
    
    console.log('Smart collections system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize smart collections:', error);
    throw error;
  }
};

/**
 * Manually triggers an update for all smart collections
 */
export const triggerFullSmartCollectionUpdate = async () => {
  try {
    const collections = await Collection.find({
      collection_type: 'smart',
      status: 'active'
    }).lean();
    
    console.log(`Manually triggering updates for ${collections.length} smart collections`);
    
    await Promise.all(
      collections.map(c => scheduleSmartCollectionUpdate(c._id))
    );
    
    return { success: true, message: `Updates triggered for ${collections.length} collections` };
  } catch (error) {
    console.error('Manual update trigger failed:', error);
    return { success: false, message: error.message };
  }
};