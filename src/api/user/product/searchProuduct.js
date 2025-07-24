import { NotFoundError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";

export const searchProduct = async (req, res, next) => {
  try {
    const { search } = req.query;

    if (!search) {
      throw new NotFoundError("Search query not found");
    }

    const results = await productModel.aggregate([
      {
        $lookup: {
          from: "categories", // actual collection name for categories
          localField: "category",
          foreignField: "_id",
          as: "categoryData"
        }
      },
      {
        $unwind: "$categoryData"
      },
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { "categoryData.name": { $regex: search, $options: "i" } }
          ]
        }
      },
      {
        $project: {
          productId: "$_id",
          name: 1,
          image: 1,
          _id: 0 ,
          thumbnail:1
        }
      }
    ]);

    return res.status(200).json({ success: true, results });
  } catch (error) {
    next(error);
  }
};
