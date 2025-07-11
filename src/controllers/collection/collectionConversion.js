import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";

/**
 * Suggests rules based on current products in a custom collection
 * @param {string} collectionId - Collection ID
 * @returns {Promise<Array>} Suggested rules
 */
export const suggestSmartCollectionRules = async (collectionId) => {
  const products = await Product.find({ collection_id: collectionId }).lean();
  if (!products.length) return [];
  
  const suggestions = [];
  const sampleSize = Math.min(products.length, 100);
  
  // Analyze common tags
  const tagCounts = {};
  products.slice(0, sampleSize).forEach(p => {
    p.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const commonTags = Object.entries(tagCounts)
    .filter(([_, count]) => count > sampleSize * 0.7)
    .map(([tag]) => ({
      column: 'tag',
      relation: 'contains',
      condition: tag
    }));
  
  if (commonTags.length) suggestions.push(...commonTags);
  
  // Analyze price range
  const prices = products.map(p => p.price?.sellingPrice).filter(Boolean);
  if (prices.length) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    suggestions.push({
      column: 'price',
      relation: 'greater_than',
      condition: (minPrice * 0.9).toFixed(2) // 10% below current min
    }, {
      column: 'price',
      relation: 'less_than',
      condition: (maxPrice * 1.1).toFixed(2) // 10% above current max
    });
  }
  
  return suggestions;
};

/**
 * Converts collection type and handles data migration
 * @param {string} collectionId - Collection ID
 * @param {string} newType - 'smart' or 'custom'
 * @param {Array} [rules] - Required when converting to smart
 * @returns {Promise<Object>} Updated collection
 */
export const convertCollectionType = async (collectionId, newType, rules = []) => {
  const collection = await Collection.findById(collectionId);
  if (!collection) throw new Error('Collection not found');
  
  if (collection.collection_type === newType) return collection;
  
  if (newType === 'smart') {
    // Convert custom to smart
    if (!rules.length) {
      rules = await suggestSmartCollectionRules(collectionId);
      if (!rules.length) {
        throw new Error('Could not generate automatic rules. Please specify rules manually.');
      }
    }
    
    collection.collection_type = 'smart';
    collection.rules = rules;
    await collection.save();
    
    await scheduleSmartCollectionUpdate(collectionId);
  } else {
    // Convert smart to custom
    // Keep current products associated
    collection.collection_type = 'custom';
    collection.rules = undefined;
    collection.disjunctive = undefined;
    await collection.save();
  }
  
  return collection;
};