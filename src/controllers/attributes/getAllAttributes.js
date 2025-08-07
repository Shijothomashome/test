import Attribute from "../../models/productAttributeModel.js";

export const getAllAttributes = async (req, res) => {
    try {

      
        const { sort,search, category, isActive, isGlobal, isVariantAttribute, isDeleted, page = 1, limit = 10 } = req.query;
        console.log(isDeleted)
     
        const filter = {};

        // Search functionality (case-insensitive search on name)
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        // Category filter
        if (category) {
            filter.categories = category;
        }

        // Boolean filters
        if (isActive === "true") filter.isActive = true;
        if (isActive === "false") filter.isActive = false;

        if (isGlobal === "true") filter.isGlobal = true;
        if (isGlobal === "false") filter.isGlobal = false;

        if (isVariantAttribute === "true") filter.isVariantAttribute = true;
        if (isVariantAttribute === "false") filter.isVariantAttribute = false;

        if (isDeleted === "true") {filter.isDeleted = true} else filter.isDeleted=false
       

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: {
                path: "categories",
                select: "name slug",
            },
        };

        const attributes = await Attribute.paginate(filter, options);

        res.json({
            success: true,
            count: attributes.totalDocs,
            totalPages: attributes.totalPages,
            currentPage: attributes.page,
            data: attributes.docs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
