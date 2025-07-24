import caroselModel from "../../../models/caroselModel.js";

export const getAllCarousel = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const carousels = await caroselModel.aggregate([
            {
                $facet: {
                    carousels: [{ $match: {} }, { $skip: (parsedPage - 1) * parsedLimit }, { $limit: parsedLimit }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ]);

        const totalItems = carousels[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalItems / parsedLimit);
        const carouselData = carousels[0].carousels;

        res.status(200).json({
            success: true,
            data: {
                totalPage: totalPages,
                carousels: carouselData,
            },
        });
    } catch (error) {
        next(error);
    }
};
