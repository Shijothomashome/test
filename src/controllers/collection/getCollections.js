// import Collection from "../../models/collectionModel.js";
// import CollectionProduct from "../../models/collectionProductModel.js";
// import { handleError } from "../../helpers/handleError.js";

// // @desc    Get all collections with filters
// // @route   GET /api/collections
// export const getCollections = async (req, res) => {
//   try {
//     const { 
//       type, 
//       status, 
//       search, 
//       page = 1, 
//       limit = 10,
//       sort = '-createdAt'
//     } = req.query;

//     const filter = {};
    
//     if (type) filter.collection_type = type;
//     if (status) filter.status = status;
//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { handle: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort,
//       lean: true
//     };

//     const collections = await Collection.paginate(filter, options);

//     // Add products_count to each collection
//     const collectionsWithCount = await Promise.all(
//       collections.docs.map(async collection => {
//         const count = await CollectionProduct.countDocuments({
//           collection: collection._id
//         });
//         return { ...collection, products_count: count };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       data: {
//         ...collections,
//         docs: collectionsWithCount
//       }
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };


import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

export const getCollections = async (req, res) => {
  try {
    const { 
      type, 
      status, 
      search, 
      page = 1, 
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    
    if (type) filter.collection_type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { handle: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      lean: true
    };

    const collections = await Collection.paginate(filter, options);

    // Add products_count to each collection
    const collectionsWithCount = await Promise.all(
      collections.docs.map(async collection => {
        const count = await Product.countDocuments({
          collection_id: collection._id,
          isDeleted: false
        });
        return { ...collection, products_count: count };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        ...collections,
        docs: collectionsWithCount
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};