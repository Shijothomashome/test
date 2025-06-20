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
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $addFields: {
                    "items.product": {
                        $mergeObjects: [
                            "$product",
                            {
                                selectedVariant: {
                                    $first: {
                                        $filter: {
                                            input: "$product.variants",
                                            as: "variant",
                                            cond: {
                                                $eq: ["$$variant._id", "$items.variantId"]
                                            }
                                        }
                                    }
                                }
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
