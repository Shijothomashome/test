// import CollectionProduct from "../../models/collectionProductModel.js";
// import { generateSlug } from "../../helpers/generateSlug.js";
// import { handleError } from "../../helpers/handleError.js";

// // @desc    Get products in collection
// // @route   GET /api/collections/:id/products
// export const getCollectionProducts = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { page = 1, limit = 10, sort = 'position' } = req.query;

//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort,
//       populate: {
//         path: 'product',
//         match: { isDeleted: false, isActive: true },
//         select: 'name price images slug variants'
//       }
//     };

//     const products = await CollectionProduct.paginate(
//       { collection: id },
//       options
//     );

//     res.status(200).json({
//       success: true,
//       data: products
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };


import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

export const getCollectionProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      select: 'name price images slug variants'
    };

    const products = await Product.paginate(
      { 
        collection_id: id,
        isDeleted: false,
        isActive: true 
      },
      options
    );

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    handleError(res, error);
  }
};