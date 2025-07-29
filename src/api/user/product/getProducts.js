import mongoose from "mongoose";
import productModel from "../../../models/productModel.js";
import { validateBody } from "twilio/lib/webhooks/webhooks.js";

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

       
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        if (!Array.isArray(categories)) categories = [categories];
        if (!Array.isArray(brands)) brands = [brands];

        // Convert to ObjectId
        const validCategories = categories
            .filter(id => mongoose.Types.ObjectId.isValid(id))
            .map(id => new mongoose.Types.ObjectId(id));

        const validBrands = brands
            .filter(id => mongoose.Types.ObjectId.isValid(id))
            .map(id => new mongoose.Types.ObjectId(id));

        const matchStage = {};
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

            {
                $addFields: {
                    offer: {
                        $round: [
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            { $subtract: ["$basePrice.mrp", "$basePrice.sellingPrice"] },
                                            "$basePrice.mrp"
                                        ]
                                    },
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            },

            {
                $project: {
                    name: 1,
                    description: 1,
                    image: "$thumbnail",
                    basePrice: 1,
                    offer: 1,
                    createdAt: 1 // Required for sorting
                }
            },

            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: sortStage },
                        { $skip: skip },
                        { $limit: limit }
                    ]
                }
            },

            {
                $unwind: {
                    path: "$metadata",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $addFields: {
                    totalCount: "$metadata.total",
                    currentPage: page,
                    totalPages: {
                        $ceil: {
                            $divide: ["$metadata.total", limit]
                        }
                    }
                }
            }
        ];

        const result = await productModel.aggregate(pipeline);
        const { data = [], totalCount = 0, totalPages = 0 } = result[0] || {};

        res.status(200).json({
            success: true,
            message: "Products fetched with filters, sorting and offer calculation",
            totalCount,
            currentPage: page,
            totalPages,
            data,
        });
    } catch (error) {
        next(error);
    }
};
