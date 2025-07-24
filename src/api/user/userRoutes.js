
import express from "express";
import { searchProduct } from "./product/searchProuduct.js";
import { getHomePageData } from "./home/getHomePageData.js";

const userRoutes = express.Router();

// Product routes
userRoutes.get("/product/search",searchProduct);

// Home page routes
userRoutes.get('/home',getHomePageData)


export default userRoutes;
