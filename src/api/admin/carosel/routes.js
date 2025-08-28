
import uploadToS3 from "../../../utils/uploadToS3.js";
import { createCarousel } from "./createCarosel.js";
import express from "express";
import { getAllCarousel } from "./getAllCarousel.js";
import updateCarousel from "./updateCarosel.js";
import { deleteCarousel } from "./deleteCarousel.js";
import { getAllCollections } from "./getCollections.js";


const carouselRoutes = express.Router();


carouselRoutes.post("/",uploadToS3.single('image'), createCarousel);
carouselRoutes.get("/", getAllCarousel);
carouselRoutes.put("/:id",uploadToS3.single("image"), updateCarousel);
carouselRoutes.delete("/:id", deleteCarousel);
carouselRoutes.get("/collections",getAllCollections)

export default carouselRoutes;
