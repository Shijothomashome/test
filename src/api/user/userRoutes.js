
import express from "express";
import { searchProduct } from "./product/searchProuduct.js";
import { getHomePageData } from "./home/getHomePageData.js";
import { createAddress } from "./address/createAddress.js";
import { auth } from "../../middlewares/auth.js";
import { updateAddress } from "./address/updateAddress.js";
import { deleteAddress } from "./address/deleteAddress.js";
import { getAllAddresses } from "./address/findAllAddress.js";
import { getAddressById } from "./address/findAddressById.js";
import { updateProfile } from "./profile/updateProfile.js";
import { getCategoriesAndSubCategories } from "./category/getCategories.js";
import { getProductsByCategoryId } from "./product/getProductByCategoryId.js";
import { getProductFilterList } from "./product/getFilterList.js";
import { getFilteredProducts } from "./product/getProducts.js";
import { getProductDetails } from "./product/getProductDetailst.js";

const userRoutes = express.Router();

// Product routes
userRoutes.get("/product/search",searchProduct);
userRoutes.get("/products/category/:categoryId",getProductsByCategoryId);
userRoutes.get("/products/filters",getProductFilterList)
userRoutes.get('/products',getFilteredProducts)
userRoutes.get('/product/:slugOrId',getProductDetails)

// Home page routes
userRoutes.get('/home',getHomePageData)

// Address routes
userRoutes.post("/address",auth,createAddress)
userRoutes.put("/address/:addressId",auth,updateAddress)
userRoutes.delete("/address/:addressId",auth,deleteAddress);
userRoutes.get("/address",auth,getAllAddresses);
userRoutes.get("/address/:addressId",auth,getAddressById);

// Profile
userRoutes.put("/profile",auth,updateProfile)

// Categories
userRoutes.get("/categories",getCategoriesAndSubCategories)


export default userRoutes;
