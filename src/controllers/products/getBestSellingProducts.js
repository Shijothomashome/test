// import Product from "../../models/productModel";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError";

//! Get best-selling products
//* @desc    Get best-selling products in the last X days
//* @route   GET /api/v1/products/best-selling
//* @access  Public

// This endpoint retrieves the best-selling products based on order data from the last X days.
// It aggregates order data to calculate total quantity sold and total revenue for each product.
// It supports pagination to limit the number of best-selling products returned.

export const getBestSellingProducts = async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Aggregate to get best-selling products
    const bestSellers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['cancelled', 'failed'] } // Exclude cancelled/failed orders
        }
      },
      { $unwind: "$items" }, // Unwind the order items array
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { totalQuantity: -1 } }, // Sort by most sold
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products", // Collection name (usually lowercase plural)
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          slug: "$product.slug",
          thumbnail: "$product.thumbnail",
          price: "$product.basePrice",
          totalSold: "$totalQuantity",
          totalRevenue: 1
        }
      }
    ]);

    res.status(200).json({ 
      success: true, 
      data: bestSellers 
    });
  } catch (error) {
    handleError(res, error);
  }
};
