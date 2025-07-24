import { NotFoundError } from "../../../constants/customErrors.js";
import caroselModel from "../../../models/caroselModel.js";

export const createCarousel = async (req, res, next) => {
    try {
        if (!req?.file || !req?.file?.location) {
            throw new NotFoundError("Carousel image is required");
        }
        console.log(req.body);

        const { isActive } = req.body;
        if (typeof isActive === "undefined") {
            throw new NotFoundError("Field 'isActive' is required");
        }

        const newCarosel = new caroselModel({
            image: req.file.location,
            isActive,
        });

        await newCarosel.save();

        res.status(201).json({
            success: true,
            message: "New carousel successfully created",
            data: newCarosel,
        });
    } catch (error) {
        next(error);
    }
};
