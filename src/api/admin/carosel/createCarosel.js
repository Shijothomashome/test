import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import caroselModel from "../../../models/caroselModel.js";

export const createCarousel = async (req, res, next) => {
    try {
        const { collectionHandle, collectionId, collectionTitle, isActive } = req.body;

       
        if (!collectionId?.trim()) {
            throw new BadRequestError("Field 'collectionId' is required");
        }
        if (!collectionHandle?.trim()) {
            throw new BadRequestError("Field 'collectionHandle' is required");
        }
        if (!collectionTitle?.trim()) {
            throw new BadRequestError("Field 'collectionTitle' is required");
        }

       
        if (typeof isActive === "undefined") {
            throw new BadRequestError("Field 'isActive' is required");
        }
        if (typeof JSON.parse(isActive) !== "boolean") {
            throw new BadRequestError("Field 'isActive' must be true or false");
        }

        
        if (!req?.file || !req?.file?.location) {
            throw new BadRequestError("Carousel image is required");
        }

        
        const newCarousel = new caroselModel({
            collectionHandle: collectionHandle.trim(),
            collectionId: collectionId.trim(),
            collectionTitle: collectionTitle.trim(),
            isActive: JSON.parse(isActive), // convert from string to boolean if needed
            image: req.file.location,
        });

        await newCarousel.save();

        res.status(201).json({
            success: true,
            message: "New carousel successfully created",
            data: newCarousel,
        });
    } catch (error) {
        next(error);
    }
};
