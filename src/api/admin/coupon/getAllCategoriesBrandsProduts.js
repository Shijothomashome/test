// controllers/coupon/getAllCategoriesBrandsProducts.js

import brandModel from "../../../models/brandModel.js";
import categoryModel from "../../../models/categoryModel.js";
import couponModel from "../../../models/couponModel.js";
import productModel from "../../../models/productModel.js";

export const getAllCategoriesBrandsProducts = async (req, res, next) => {
    try {
        const {
            product_search = "",
            product_page = 1,
            category_search = "",
            category_page = 1,
            brand_search = "",
            brand_page = 1,
            couponId
        } = req.query;

        
        // Convert page params to numbers (default = 1)
        const categoryPage = parseInt(category_page, 10) || 1;
        const brandPage = parseInt(brand_page, 10) || 1;
        const productPage = parseInt(product_page, 10) || 1;

        // Fetch coupon only if couponId is provided
        let coupon = null;
        if (couponId!=='add') {
            coupon = await couponModel
                .findById(couponId)
                .populate("applicableCategories", "_id name")
                .populate("applicableBrands", "_id name")
                .populate("applicableProducts", "_id name")
                .lean();
        }

        // Build regex filters for searches
        const categoryFilter = { name: { $regex: category_search, $options: "i" } };
        const brandFilter = { name: { $regex: brand_search, $options: "i" } };
        const productFilter = { name: { $regex: product_search, $options: "i" } };

        // Fetch all data in parallel
        const [categories, brands, products] = await Promise.all([
            categoryModel
                .find(categoryFilter, { _id: 1, name: 1 })
                .skip((categoryPage - 1) * 10)
                .limit(10)
                .lean(),
            brandModel
                .find(brandFilter, { _id: 1, name: 1 })
                .skip((brandPage - 1) * 10)
                .limit(10)
                .lean(),
            productModel
                .find(productFilter, { _id: 1, name: 1 })
                .skip((productPage - 1) * 10)
                .limit(10)
                .lean(),
        ]);

        // Respond
        return res.status(200).json({
            success: true,
            data: {
                categories,
                brands,
                products,
                coupon,
            },
        });

    } catch (error) {
        next(error);
    }
};
