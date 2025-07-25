import brandModel from "../../../models/brandModel.js";
import caroselModel from "../../../models/caroselModel.js";
import categoryModel from "../../../models/categoryModel.js";
import productModel from "../../../models/productModel.js";


export const getHomePageData = async (req, res, next) => {
    try {

        
        const { carouselLimit } = req.query;
        const limit = parseInt(carouselLimit) || 5;
        const [categories, brands, carousels, featuredProducts] = await Promise.all([
            categoryModel.aggregate([{ $match: { parentCategory: null } }, { $project: { name: 1, image: 1 } }]),
            brandModel.aggregate([{ $project: { name: 1, logo: 1 } }]),
            caroselModel.aggregate([{ $match: { isActive: true } }, { $project: { _id: 0, image: 1 } }, { $limit: limit }]),
            productModel.aggregate([
                { $match: { isFeatured: true } },
                {
                    $addFields: {
                        offer: {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $divide: [{ $subtract: ["$basePrice.mrp", "$basePrice.sellingPrice"] }, "$basePrice.mrp"],
                                        },
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        image: 1,
                        basePrice: 1,
                        offer: 1,
                    },
                },
            ]),
        ]);

        return res.status(200).json({
            success: true,
            message: "Homepage data fetched successfully",
            data: {
                categories,
                brands,
                carousels,
                featuredProducts,
            },
        });
    } catch (error) {
        next(error);
    }
};
