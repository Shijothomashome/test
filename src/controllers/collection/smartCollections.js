import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import cache from "../../config/cache.js";
// // import queue from "../../config/queue.js";

// /**
//  * Builds MongoDB query from smart collection rules
//  * @param {Array} rules - Collection rules
//  * @param {boolean} disjunctive - OR vs AND logic
//  * @returns {Object} MongoDB query
//  */
// export const buildSmartCollectionQuery = (rules, disjunctive = false) => {
//   if (!rules || !rules.length) return {};
  
//   const conditions = rules.map(rule => {
//     switch (rule.column) {
//       case 'product_type':
//         return { productType: buildCondition(rule.relation, rule.condition) };
//       case 'vendor':
//         return { vendor: buildCondition(rule.relation, rule.condition) };
//       case 'title':
//         return { name: buildCondition(rule.relation, rule.condition) };
//       case 'tag':
//         return { tags: buildCondition(rule.relation, rule.condition) };
//       case 'price':
//         return { 'price.sellingPrice': buildCondition(rule.relation, parseFloat(rule.condition)) };
//       case 'inventory_stock':
//         return { 'inventory.stock': buildCondition(rule.relation, parseInt(rule.condition)) };
//       case 'weight':
//         return { weight: buildCondition(rule.relation, parseFloat(rule.condition)) };
//       case 'variant_title':
//         return { 'variants.title': buildCondition(rule.relation, rule.condition) };
//       default:
//         return {};
//     }
//   }).filter(cond => Object.keys(cond).length > 0);

//   if (conditions.length === 0) return {};
//   return disjunctive ? { $or: conditions } : { $and: conditions };
// };

// const buildCondition = (relation, value) => {
//   switch (relation) {
//     case 'equals': return value;
//     case 'not_equals': return { $ne: value };
//     case 'greater_than': return { $gt: value };
//     case 'less_than': return { $lt: value };
//     case 'starts_with': return new RegExp(`^${value}`, 'i');
//     case 'ends_with': return new RegExp(`${value}$`, 'i');
//     case 'contains': return new RegExp(value, 'i');
//     default: return value;
//   }
// };

// /**
//  * Finds products matching smart collection rules
//  * @param {Object} collection - Smart collection
//  * @returns {Promise<Array>} Matching products
//  */
// export const getMatchingProductsForSmartCollection = async (collection) => {
//   if (collection.collection_type !== 'smart') return [];
  
//   const query = buildSmartCollectionQuery(collection.rules, collection.disjunctive);
//   return Product.find(query).select('_id').lean();
// };

// /**
//  * Gets collection products with caching
//  * @param {string} collectionId - Collection ID
//  * @returns {Promise<Array>} Collection products
//  */
// export const getCollectionProductsWithCache = async (collectionId) => {
//   const cacheKey = `collection:products:${collectionId}`;
//   const cached = await cache.get(cacheKey);
//   if (cached) return cached;
  
//   const collection = await Collection.findById(collectionId);
//   if (!collection) throw new Error('Collection not found');
  
//   let products;
//   if (collection.collection_type === 'smart') {
//     const productIds = await getMatchingProductsForSmartCollection(collection);
//     products = await Product.find({ _id: { $in: productIds.map(p => p._id) } });
//   } else {
//     products = await Product.find({ collection_id: collectionId });
//   }
  
//   await cache.set(cacheKey, products, 3600); 
//   return products;
// };


export const buildSmartCollectionQuery = (rules, disjunctive = false) => {
  if (!rules || !rules.length) return {};
  
  const conditions = rules.map(rule => {
    switch (rule.column) {
      case 'product_type':
        return { productType: buildCondition(rule.relation, rule.condition) };
      case 'vendor':
        return { vendor: buildCondition(rule.relation, rule.condition) };
      case 'title':
        return { name: buildCondition(rule.relation, rule.condition) };
      case 'tag':
        return { tags: buildCondition(rule.relation, rule.condition) };
      case 'price':
        return { 'price.sellingPrice': buildCondition(rule.relation, parseFloat(rule.condition)) };
      case 'inventory_stock':
        return { 'inventory.stock': buildCondition(rule.relation, parseInt(rule.condition)) };
      case 'weight':
        return { weight: buildCondition(rule.relation, parseFloat(rule.condition)) };
      case 'variant_title':
        return { 'variants.title': buildCondition(rule.relation, rule.condition) };
      default:
        return {};
    }
  }).filter(cond => Object.keys(cond).length > 0);

  if (conditions.length === 0) return {};
  return disjunctive ? { $or: conditions } : { $and: conditions };
};

const buildCondition = (relation, value) => {
  switch (relation) {
    case 'equals': return value;
    case 'not_equals': return { $ne: value };
    case 'greater_than': return { $gt: value };
    case 'less_than': return { $lt: value };
    case 'starts_with': return new RegExp(`^${value}`, 'i');
    case 'ends_with': return new RegExp(`${value}$`, 'i');
    case 'contains': return new RegExp(value, 'i');
    default: return value;
  }
};

export const getMatchingProductsForSmartCollection = async (collection) => {
  if (collection.collection_type !== 'smart') return [];
  
  const query = buildSmartCollectionQuery(collection.rules, collection.disjunctive);
  return Product.find(query).select('_id').lean();
};

export const getCollectionProductsWithCache = async (collectionId) => {
  const cacheKey = `collection:products:${collectionId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  
  const collection = await Collection.findById(collectionId);
  if (!collection) throw new Error('Collection not found');
  
  let products;
  if (collection.collection_type === 'smart') {
    const productIds = await getMatchingProductsForSmartCollection(collection);
    products = await Product.find({ _id: { $in: productIds.map(p => p._id) } });
  } else {
    products = await Product.find({ collection_id: collectionId });
  }
  
  await cache.set(cacheKey, products, 3600); 
  return products;
};

export const ensureSmartCollectionIndexes = async () => {
  await Product.collection.createIndex({ tags: 1 });
  await Product.collection.createIndex({ 'price.sellingPrice': 1 });
  await Product.collection.createIndex({ productType: 1 });
  await Product.collection.createIndex({ vendor: 1 });
  await Product.collection.createIndex({ 'inventory.stock': 1 });
  await Product.collection.createIndex({ weight: 1 });
  await Product.collection.createIndex({ 'variants.title': 1 });
};



// Add to smartCollections.js

/**
 * Checks if a product matches a smart collection's rules
 */
export const checkProductMatchesCollection = async (productId, collectionId) => {
  const collection = await Collection.findById(collectionId);
  if (!collection || collection.collection_type !== 'smart') return false;
  
  const query = buildSmartCollectionQuery(collection.rules, collection.disjunctive);
  const count = await Product.countDocuments({
    _id: productId,
    ...query
  });
  
  return count > 0;
};

/**
 * Gets all smart collections a product belongs to
 */
export const getProductSmartCollections = async (productId) => {
  return Collection.find({
    collection_type: 'smart',
    status: 'active'
  }).then(async (collections) => {
    const matchingCollections = [];
    
    for (const collection of collections) {
      const matches = await checkProductMatchesCollection(productId, collection._id);
      if (matches) {
        matchingCollections.push(collection);
      }
    }
    
    return matchingCollections;
  });
};