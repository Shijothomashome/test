
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
import { createWishlist } from "./wishlist/addToWishList.js";
import { removeFromWishlist } from "./wishlist/removeFromWishlist.js";
import { getWishlist } from "./wishlist/getWishlist.js";
import userModel from "../../models/userModel.js";
import { addToCart } from "./cart/addToCart.js";
import { getCart } from "./cart/getCart.js";
import { removeFromCart } from "./cart/removeFromCart.js";
import { changeQuantity } from "./cart/changeCount.js";

const userRoutes = express.Router();

// Product routes
userRoutes.get("/product/search",searchProduct);
userRoutes.get("/products/category/:categoryId",auth,getProductsByCategoryId);
userRoutes.get("/products/filters",getProductFilterList)
userRoutes.get('/products',auth,getFilteredProducts)
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
userRoutes.get("/categories",getCategoriesAndSubCategories);

// Wishlist
userRoutes.post("/wishlist",auth,createWishlist);
userRoutes.delete('/wishlist/:productId',auth,removeFromWishlist);
userRoutes.get("/wishlist",auth,getWishlist)

// Cart
userRoutes.post("/cart",auth,addToCart)
userRoutes.get("/cart",auth,getCart);
userRoutes.delete('/cart',auth,removeFromCart);
userRoutes.patch("/cart/update-quantity",auth,changeQuantity)


export default userRoutes;
