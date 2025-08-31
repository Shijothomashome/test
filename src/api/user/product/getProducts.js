import mongoose from "mongoose";
import productModel from "../../../models/productModel.js";

export const getFilteredProducts = async (req, res, next) => {
  try {
    let {
      categories = [],
      brands = [],
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const isUserLoggedIn = req.user && req.user._id;
    const userObjectId = isUserLoggedIn
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    if (!Array.isArray(categories)) categories = [categories];
    if (!Array.isArray(brands)) brands = [brands];

    const validCategories = categories
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const validBrands = brands
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    // ✅ Base filters: only active and not deleted
    const matchStage = {
      isActive: true,
      isDeleted: false,
    };

    if (validCategories.length > 0) {
      matchStage.category = { $in: validCategories };
    }
    if (validBrands.length > 0) {
      matchStage.brand = { $in: validBrands };
    }

    const sortStage = {};
    if (sortBy) {
      sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const pipeline = [
      { $match: matchStage },

      // Add offer percentage
      {
        $addFields: {
          offer: {
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

      // Project only needed fields
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
          totalPages: {
            $ceil: {
              $divide: ["$metadata.total", limit],
            },
          },
        },
      },
    ];

    const result = await productModel.aggregate(pipeline);
    const { data = [], totalCount = 0, totalPages = 0 } = result[0] || {};

    res.status(200).json({
      success: true,
      message: "Products fetched with filters, sorting, offers, and wishlist flag",
      totalCount,
      currentPage: page,
      totalPages,
      data,
    });
  } catch (error) {
    next(error);
  }
};
