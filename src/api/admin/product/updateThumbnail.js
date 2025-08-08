import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";

import s3Utils from "../../../utils/s3Utils.js";

export const updateThumbnail = async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError("Invalid product Id");
        }
        let thumbnail = "";
        if (!req.file || !req.file.location) {
            throw new NotFoundError("Image file not uploaded");
        }
        thumbnail = req.file.location;

        const product = await productModel.findOne({ _id: productId });
        if (!product) {
            throw new NotFoundError("Product not found");
        }

        await s3Utils.deleteFromS3(product.thumbnail);
        const result = await productModel.findByIdAndUpdate(productId, { thumbnail: thumbnail }, { new: true });

        res.status(200).json({ success: true, message: "Product thumbnail image successfully updated", thumbnail: thumbnail });
    } catch (error) {
        next(error);
    }
};
