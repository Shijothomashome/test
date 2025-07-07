import mongoose from "mongoose";
import cartModel from "../../models/cartModel.js";

const getCart = async (req, res) => {
    try {
        const userId = req.user?._id || "68497b8c9b334bd04e5b107f";

        const cart = await cartModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    let: { productId: "$items.productId" },
                    pipeline: [
                        { 
                            $match: { 
                                $expr: { $eq: ["$_id", "$$productId"] } 
                            } 
                        },
                        {
                            $project: {
                                name: 1,
                                slug: 1,
                                description: 1,
                                shortDescription: 1,
                                category: 1,
                                brand: 1,
                                tags: 1,
                                thumbnail: 1,
                                images: 1,
                                basePrice: 1,
                                baseInventory: 1,
                                isFreeShipping: 1,
                                shippingClass: 1,
                                taxable: 1,
                                variants: {
                                    $filter: {
                                        input: "$variants",
                                        as: "variant",
                                        cond: { $eq: ["$$variant._id", "$items.variantId"] }
                                    }
                                }
                            }
                        }
                    ],
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $addFields: {
                    "items.product": {
                        $mergeObjects: [
                            {
                                _id: "$product._id",
                                name: "$product.name",
                                slug: "$product.slug",
                                description: "$product.description",
                                shortDescription: "$product.shortDescription",
                                category: "$product.category",
                                brand: "$product.brand",
                                tags: "$product.tags",
                                thumbnail: "$product.thumbnail",
                                images: "$product.images",
                                basePrice: "$product.basePrice",
                                baseInventory: "$product.baseInventory",
                                isFreeShipping: "$product.isFreeShipping",
                                shippingClass: "$product.shippingClass",
                                taxable: "$product.taxable"
                            },
                            {
                                selectedVariant: { $arrayElemAt: ["$product.variants", 0] }
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    items: { $push: "$items" },
                    totalPrice: { $first: "$totalPrice" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" }
                }
            }
        ]);

        if (!cart || !cart.length) {
            return res.status(404).json({
                message: "Cart not found",
                status: false
            });
        }

        return res.status(200).json({
            message: "Cart found",
            status: true,
            data: cart[0]
        });

    } catch (error) {
        console.error("getCart error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export default getCart;
