import brandModel from "../../../models/brandModel.js";
import caroselModel from "../../../models/caroselModel.js";
import categoryModel from "../../../models/categoryModel.js";
import productModel from "../../../models/productModel.js";
import mongoose from "mongoose";
import reviewModel from "../../../models/reviewModel.js";

export const getHomePageData = async (req, res, next) => {
  try {
    const { carouselLimit } = req.query;
    const limit = parseInt(carouselLimit) || 5;

    const isUserLoggedIn = req.user && req.user._id;
    const userObjectId = isUserLoggedIn
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    const [categories, brands, carousels, featuredProducts, reviews] =
      await Promise.all([
        // Categories
        categoryModel.aggregate([
          { $match: { parentCategory: null } },
          { $project: { name: 1, image: 1 } },
        ]),

        // Brands
        brandModel.aggregate([{ $project: { name: 1, logo: 1 } }]),

        // Carousels
        caroselModel.aggregate([
          { $match: { isActive: true } },
          { $limit: limit },
        ]),

        // Featured Products
        productModel.aggregate([
          { $match: { isFeatured: true } },

          // Lookup reviews and calculate average rating
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "productId",
              as: "reviews",
            },
          },
          {
            $addFields: {
              averageRating: {
                $cond: [
                  { $gt: [{ $size: "$reviews" }, 0] },
                  { $round: [{ $avg: "$reviews.rating" }, 1] },
                  0,
                ],
              },
              reviewCount: { $size: "$reviews" },
            },
          },
          { $project: { reviews: 0 } },

          // Offer calculation
          {
            $addFields: {
              offer: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $subtract: [
                              "$basePrice.mrp",
                              "$basePrice.sellingPrice",
                            ],
                          },
                          "$basePrice.mrp",
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
            },
          },

          // Wishlist logic
          ...(isUserLoggedIn
            ? [
                {
                  $lookup: {
                    from: "wishlists",
                    let: { productId: "$_id" },
                    pipeline: [
                      { $match: { userId: userObjectId } },
                      {
                        $project: {
                          hasProduct: {
                            $in: ["$$productId", "$products.productId"],
                          },
                        },
                      },
                    ],
                    as: "wishlistInfo",
                  },
                },
                {
                  $addFields: {
                    wishlist: {
                      $cond: {
                        if: { $gt: [{ $size: "$wishlistInfo" }, 0] },
                        then: { $arrayElemAt: ["$wishlistInfo.hasProduct", 0] },
                        else: false,
                      },
                    },
                  },
                },
              ]
            : [
                {
                  $addFields: {
                    wishlist: false,
                  },
                },
              ]),

          // Final projection
          {
            $project: {
              name: 1,
              description: 1,
              image: "$thumbnail",
              basePrice: 1,
              offer: 1,
              wishlist: 1,
              averageRating: 1,
              reviewCount: 1,
            },
          },
        ]),

        // Recent reviews (with user info)
        reviewModel
          .find({})
          .populate({ path: "user", select: "name" })
          .limit(4),
      ]);

    return res.status(200).json({
      success: true,
      message: "Homepage data fetched successfully",
      data: {
        categories,
        brands,
        carousels,
        featuredProducts,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};
