import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";
import Collection from "../../../models/collectionModel.js";

export const getAllProductsFromCollection = async (req, res, next) => {
    try {
        const { collectionHandle } = req.params;

        // Validate handle (must be string, not ObjectId)
        if (!collectionHandle || mongoose.Types.ObjectId.isValid(collectionHandle)) {
            throw new BadRequestError("Invalid collection handle");
        }

        // Query params
        let { page = 1, limit = 12, sortBy = "createdAt", sortOrder = "desc" } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        // Validate sort order
        const order = sortOrder === "asc" ? 1 : -1;
        const sortStage = { [sortBy]: order };
        const skip = (page - 1) * limit;

        // Find collection
        const collection = await Collection.findOne({ handle: collectionHandle });
        if (!collection) throw new NotFoundError("Collection not found");

        // Wishlist logic (check if user logged in)
        const isUserLoggedIn = req.user && req.user?._id;
        const userObjectId = isUserLoggedIn ? new mongoose.Types.ObjectId(req.user._id) : null;

        // Aggregation pipeline
        const pipeline = [
            {
                $match: {
                    collection_ids: { $in: [collection._id] }, // must match collection id
                },
            },

            // Add discount percentage
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

            // Wishlist enrichment if logged in
            ...(isUserLoggedIn
                ? [
                      {
                          $lookup: {
                              from: "wishlists",
                              let: { productId: "$_id" },
                              pipeline: [
                                  {
                                      $match: {
                                          userId: userObjectId,
                                      },
                                  },
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
                      {
                          $addFields: {
                              wishlist: false,
                          },
                      },
                  ]),

            // Only return required fields
            {
                $project: {
                    name: 1,
                    description: 1,
                    image: "$thumbnail",
                    basePrice: 1,
                    offer: 1,
                    createdAt: 1,
                    wishlist: 1,
                },
            },

            // Pagination + metadata
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: sortStage },
                        { $skip: skip },
                        { $limit: limit },
                    ],
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
                    totalPages: {
                        $ceil: { $divide: ["$metadata.total", limit] },
                    },
                },
            },
        ];

        const result = await productModel.aggregate(pipeline);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            ...result[0], // contains { data, metadata, totalCount, currentPage, totalPages }
        });
    } catch (error) {
        next(error);
    }
};
