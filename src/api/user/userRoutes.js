
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
import isLoggedIn from "../../middlewares/isLoggedIn.js";
import { getAllOrders } from "./order/getOrders.js";
import { getOrderDetails } from "./order/getOrderDetails.js";
import { createReview } from "./review/createReview.js";
import { getAllReviews } from "./review/getAllReviews.js";
import { likeReview } from "./review/likeReview.js";
import { dislikeReview } from "./review/dislikeReview.js";
import uploadToS3 from "../../utils/uploadToS3.js";
import { updateReview } from "../../controllers/review/updateReview.js";
import { updateReviewStatus } from "./review/updateStatus.js";
import { cancellOrder } from "./order/cancellOrder.js";
import { reOrder } from "./order/reorder.js";
import { getAllProductsFromCollection } from "./collection/getAllProductsFromCollection.js";
import { getAllBrands } from "./brands/getAllBrands.js";


const userRoutes = express.Router();

// Product routes
userRoutes.get("/product/search",searchProduct);
userRoutes.get("/products/collections/:collectionHandle",getAllProductsFromCollection)
userRoutes.get("/products/category/:categoryId",isLoggedIn(),getProductsByCategoryId); // bugfix if the user exists need to check wishlist else not 
userRoutes.get("/products/filters",getProductFilterList)
userRoutes.get('/products',isLoggedIn(),getFilteredProducts) // bugfix if the user exists need to check wishlist else not 
userRoutes.get('/product/:slugOrId',getProductDetails)

// Home page routes
userRoutes.get('/home',isLoggedIn(),getHomePageData)

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
userRoutes.post("/cart/checkout",authenticate(),checkout)

// Order
userRoutes.get("/orders",authenticate(),getAllOrders);
userRoutes.get("/orders/:orderId",authenticate(),getOrderDetails)       
userRoutes.patch("/orders/cancel/:orderId",authenticate(),cancellOrder);
userRoutes.post('/orders/reorder/:orderId',authenticate(),reOrder)
     
// review
userRoutes.post("/reviews", authenticate(["customer", "admin"]),uploadToS3.array("images"), createReview);
userRoutes.get("/reviews", authenticate(["customer", "admin"]), getAllReviews);
userRoutes.patch("/reviews/like/:reviewId", authenticate(["customer", "admin"]), likeReview);
userRoutes.patch("/reviews/dislike/:reviewId", authenticate(["customer", "admin"]), dislikeReview);

// Collection
userRoutes.get("/collections/:collectionId",authenticate(),getAllProductsFromCollection)

// Brands
userRoutes.get("/brands",getAllBrands)





export default userRoutes;
