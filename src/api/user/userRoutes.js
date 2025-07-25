
import express from "express";
import { searchProduct } from "./product/searchProuduct.js";
import { getHomePageData } from "./home/getHomePageData.js";
import { createAddress } from "./address/createAddress.js";
import { auth } from "../../middlewares/auth.js";
import { updateAddress } from "./address/updateAddress.js";
import { deleteAddress } from "./address/deleteAddress.js";
import { getAllAddresses } from "./address/findAllAddress.js";
import { getAddressById } from "./address/findAddressById.js";

const userRoutes = express.Router();

// Product routes
userRoutes.get("/product/search",searchProduct);

// Home page routes
userRoutes.get('/home',getHomePageData)

// Address routes
userRoutes.post("/address",auth,createAddress)
userRoutes.put("/address/:addressId",auth,updateAddress)
userRoutes.delete("/address/:addressId",auth,deleteAddress);
userRoutes.get("/address",auth,getAllAddresses);
userRoutes.get("/address/:addressId",auth,getAddressById);




export default userRoutes;
