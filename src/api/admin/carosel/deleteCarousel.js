import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import caroselModel from "../../../models/caroselModel.js";

export const deleteCarousel = async (req, res, next) => {
    try {
        const { id } = req.params;

       
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid Carousel ID");
        }

 
        const carousel = await caroselModel.findByIdAndDelete(id);

        if (!carousel) {
            throw new NotFoundError("Carousel not found with the given ID");
        }

        return res.status(200).json({
            success: true,
            message: "Carousel deleted successfully",
            data:carousel
        });

    } catch (error) {
        next(error);
    }
};
