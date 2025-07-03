import { scheduleSmartCollectionUpdate } from '../utils/collectionQueue.js';

/**
 * Sets up Mongoose middleware for collections
 * @param {mongoose.Schema} collectionSchema - The Mongoose Collection schema
 */
export const setupCollectionHooks = (collectionSchema) => {
  // After a collection document is saved
  collectionSchema.post('save', async function(doc) {
    try {
      if (doc.collection_type === 'smart') {
        console.log(`[Hook] Triggering smart collection update for ${doc._id}`);
        await scheduleSmartCollectionUpdate(doc._id);
      }
    } catch (error) {
      console.error('[Hook] Error in post-save hook:', error);
    }
  });
  
  // After findOneAndUpdate operations
  collectionSchema.post('findOneAndUpdate', async function(doc) {
    try {
      if (doc && doc.collection_type === 'smart') {
        console.log(`[Hook] Triggering update after findOneAndUpdate for ${doc._id}`);
        await scheduleSmartCollectionUpdate(doc._id);
      }
    } catch (error) {
      console.error('[Hook] Error in post-findOneAndUpdate hook:', error);
    }
  });

  // For direct update operations
  collectionSchema.post('updateOne', async function(result) {
    try {
      const collection = await this.model.findOne(this.getQuery());
      if (collection && collection.collection_type === 'smart') {
        console.log(`[Hook] Triggering update after updateOne for ${collection._id}`);
        await scheduleSmartCollectionUpdate(collection._id);
      }
    } catch (error) {
      console.error('[Hook] Error in post-updateOne hook:', error);
    }
  });
};