import brandModel from "../../../models/brandModel.js";
import categoryModel from "../../../models/categoryModel.js";

export const getProductFilterList = async (req, res, next) => {
    try {
        const { brand_search = "", category_search = "" } = req.query;

        const [brands, categories] = await Promise.all([
            brandModel
                .find({ name: { $regex: brand_search, $options: "i" } })
                .select("name"),

            categoryModel
                .find({ name: { $regex: category_search, $options: "i" } })
                .select("name"),
        ]);

        res.status(200).json({
            success: true,
            message: "Filter data fetched successfully",
            data: {
                brands,
                categories,
            },
        });
    } catch (error) {
        next(error);
    }
};
