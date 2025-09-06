import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";
import Collection from "../../../models/collectionModel.js";

export const getAllProductsFromCollection = async (req, res, next) => {
  try {
    const { collectionHandle } = req.params;

    if (!collectionHandle || mongoose.Types.ObjectId.isValid(collectionHandle)) {
      throw new BadRequestError("Invalid collection handle");
    }

    let { page = 1, limit = 12, sortBy = "createdAt", sortOrder = "desc" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const order = sortOrder === "asc" ? 1 : -1;
    const sortStage = { [sortBy]: order };
    const skip = (page - 1) * limit;

    const collection = await Collection.findOne({ handle: collectionHandle });
    if (!collection) throw new NotFoundError("Collection not found");

    const isUserLoggedIn = req.user && req.user?._id;
    const userObjectId = isUserLoggedIn ? new mongoose.Types.ObjectId(req.user._id) : null;

    const pipeline = [
      {
        $match: {
          collection_ids: { $in: [collection._id] },
        },
      },

      // ⭐ Lookup only approved reviews
      {
        $lookup: {
          from: "reviews",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$product", "$$productId"] },
                status: "approved",
              },
            },
            { $project: { rating: 1 } },
          ],
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
          ratingCount: {
            $size: {
              $filter: {
                input: "$reviews",
                as: "r",
                cond: { $ifNull: ["$$r.rating", false] },
              },
            },
          },
        },
      },
      {
        $project: { reviews: 0 },
      },

      // ⭐ Add discount percentage
      {
        $addFields: {
          offer: {
            $cond: [
              { $gt: ["$basePrice.mrp", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ["$basePrice.mrp", "$basePrice.sellingPrice"] },
                          "$basePrice.mrp",
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      // ⭐ Wishlist enrichment
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
                      hasProduct: { $in: ["$$productId", "$products.productId"] },
                    },
                  },
                ],
                as: "wishlistInfo",
              },
            },
            {
              $addFields: {
                wishlist: {
                  $cond: [
                    { $gt: [{ $size: "$wishlistInfo" }, 0] },
                    { $arrayElemAt: ["$wishlistInfo.hasProduct", 0] },
                    false,
                  ],
                },
              },
            },
          ]
        : [
            { $addFields: { wishlist: false } },
          ]),

      // ⭐ Only return required fields
      {
        $project: {
          name: 1,
          description: 1,
          image: "$thumbnail",
          basePrice: 1,
          offer: 1,
          createdAt: 1,
          wishlist: 1,
          averageRating: 1,
          ratingCount: 1,
        },
      },

      // ⭐ Pagination
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
        },
      },
      {
        $unwind: {
          path: "$metadata",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          totalCount: "$metadata.total",
          currentPage: page,
          totalPages: { $ceil: { $divide: ["$metadata.total", limit] } },
        },
      },
    ];

    const result = await productModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ...result[0],
    });
  } catch (error) {
    next(error);
  }
};
