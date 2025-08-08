import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";

import s3Utils from "../../../utils/s3Utils.js";

export const updateSubProductImages = async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError("Invalid product Id");
        }

        if (!req.files || req.files.length == 0) {
            throw new NotFoundError("Image not uploaded");
        }

        let images = [];
        for (let i of req.files) {
            images.push(i.location);
        }

        const product = await productModel.findOne({ _id: productId });
        if (!product) throw new NotFoundError("Product not found");

        product.images = [...product.images, ...images];
        await product.save();

        res.status(200).json({ success: true, message: "Product images successfully updated", images: product.images });
    } catch (error) {
        next(error);
    }
};
