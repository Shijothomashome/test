
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
import authenticate from "../../middlewares/authenticate.js";
import { getCheckoutInfo } from "./cart/getCheckoutInfo.js";
import { checkout } from "./cart/checkout.js";


const userRoutes = express.Router();

// Product routes
userRoutes.get("/product/search",searchProduct);
userRoutes.get("/products/category/:categoryId",authenticate,getProductsByCategoryId);
userRoutes.get("/products/filters",getProductFilterList)
userRoutes.get('/products',authenticate,getFilteredProducts)
userRoutes.get('/product/:slugOrId',getProductDetails)

// Home page routes
userRoutes.get('/home',getHomePageData)

// Address routes
userRoutes.post("/address",authenticate(),createAddress)
userRoutes.put("/address/:addressId",authenticate(),updateAddress)
userRoutes.delete("/address/:addressId",authenticate(),deleteAddress);
userRoutes.get("/address",authenticate(),getAllAddresses);
userRoutes.get("/address/:addressId",authenticate(),getAddressById);

// Profile
userRoutes.put("/profile",authenticate(),updateProfile)

// Categories
userRoutes.get("/categories",getCategoriesAndSubCategories);

// Wishlist
userRoutes.post("/wishlist",authenticate(),createWishlist);
userRoutes.delete('/wishlist/:productId',authenticate(),removeFromWishlist);
userRoutes.get("/wishlist",authenticate(),getWishlist)

// Cart
userRoutes.post("/cart",authenticate(),addToCart)
userRoutes.get("/cart",authenticate(),getCart);
userRoutes.delete('/cart',authenticate(),removeFromCart);
userRoutes.patch("/cart/update-quantity",authenticate(),changeQuantity);
userRoutes.get("/cart/checkout",authenticate(),getCheckoutInfo)
userRoutes.post("/cart/checkout",checkout)



export default userRoutes;
