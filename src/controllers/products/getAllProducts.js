import { BadRequestError, NotFoundError } from "../../constants/customErrors.js";
import Product from "../../models/productModel.js";
import { setIsDealOfTheDay } from "./setDealOfTheDayProduct.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const limit = 10;
        const { search, page = 1, status, isFeatured, isFreeShipping, sort, sortBy } = req.query;
        const sortValue = sort === "asc" ? 1 : -1;
        let sortKey = "id";

        if (sortBy) {
            if (sortBy === "date") sortKey = "createdAt";
            else if (sortBy === "price") sortKey = "maxPrice";
            else sortKey = sortBy;
        }

        const sortStage = {
            [sortKey]: sortValue,
        };

        const matchStage = {};
        if (status === "active") matchStage.isActive = true;
        if (status === "inActive") matchStage.isActive = false;
        if (isFeatured === "true") matchStage.isFeatured = true;
        if (isFreeShipping === "true") matchStage.isFreeShipping = true;
        if (search) {
            matchStage.name = {
                $regex: search,
                $options: "i",
            };
        }

        const data = await Product.aggregate([
            {
                $facet: {
                    products: [
                        { $match: matchStage },
                        {
                            $lookup: {
                                from: "categories",
                                localField: "category",
                                foreignField: "_id",
                                as: "categoryData",
                            },
                        },
                        { $unwind: "$categoryData" },
                        {
                            $project: {
                                category: "$categoryData.name",
                                name: 1,
                                thumbnail: 1,
                                minPrice: 1,
                                maxPrice: 1,
                                isActive: 1,
                                isFeatured: 1,
                                isDealOfTheDay:1,
                                baseInventory: 1,
                                createdAt: 1,
                                
                            },
                        },
                        { $sort: sortStage },
                        { $skip: (parseInt(page) - 1) * limit },
                        { $limit: limit },
                    ],
                    totalCount: [{ $match: matchStage }, { $count: "total" }],
                },
            },
            {
                $project: {
                    products: 1,
                    totalCount: {
                        $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
                    },
                },
            },
        ]);

        res.status(200).json({ success: true, data: data[0] });
        
    } catch (error) {
        next(error);
    }
};
