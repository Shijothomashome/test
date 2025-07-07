import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";
import { buildSmartCollectionQuery } from "./smartCollections.js";

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

    const collection = await Collection.findById(id);
    if (!collection) {
      throw new Error("Collection not found", 404);
    }

    let products;
    if (collection.collection_type === 'smart') {
      const query = buildSmartCollectionQuery(collection.rules, collection.disjunctive);
      products = await Product.paginate(query, options);
    } else {
      products = await Product.paginate(
        { 
          collection_id: id,
          isDeleted: false,
          isActive: true 
        },
        options
      );
    }

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    handleError(res, error);
  }
};