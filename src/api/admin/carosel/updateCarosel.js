import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import { deleteImage } from "../../../controllers/imageUpload/uploadsController.js";
import caroselModel from "../../../models/caroselModel.js";
import { deleteImageFromS3 } from "../../../utils/deleteImageFromS3.js";

const updateCarousel = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new NotFoundError("Carousel ID is not valid");
        }

        const carousel = await caroselModel.findById(id);
        if (!carousel) {
            throw new NotFoundError("The carousel data is not found");
        }

        const image = req?.file?.location;
        const { isActive } = req.body;

        if (image) {
            const isDeleted = await deleteImageFromS3(carousel.image);
            if (!isDeleted) {
                throw new BadRequestError("Something went wrong. Failed to delete image");
            }
        }

        const updateData = {};
        if (typeof isActive !== "undefined") updateData.isActive = isActive;
        if (image) updateData.image = image;

        // ✅ Perform update
        const updatedCarousel = await caroselModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Carousel updated successfully",
            data: updatedCarousel,
        });
    } catch (error) {
        next(error);
    }
};

export default updateCarousel;
