
import express from "express";
import { searchProduct } from "./product/searchProuduct.js";
import { getHomePageData } from "./home/getHomePageData.js";
import { createAddress } from "./address/createAddress.js";

const userRoutes = express.Router();

// Product routes
userRoutes.get("/product/search",searchProduct);

// Home page routes
userRoutes.get('/home',getHomePageData)

// Address routes
userRoutes.post("/address",createAddress)



export default userRoutes;
