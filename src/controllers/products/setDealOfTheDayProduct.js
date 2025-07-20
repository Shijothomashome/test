import mongoose from "mongoose";
import Product from "../../models/productModel.js";

export const setIsDealOfTheDay = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(productId);

    const result = await Product.bulkWrite([
     
      {
        updateMany: {
          filter: { _id: { $ne: objectId }, isDealOfTheDay: true },
          update: { $set: { isDealOfTheDay: false } },
        },
      },
      
      {
        updateOne: {
          filter: { _id: objectId },
          update: { $set: { isDealOfTheDay: true } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "The product marked as Deal of the Day",
    });
  } catch (error) {
    next(error);
  }
};
