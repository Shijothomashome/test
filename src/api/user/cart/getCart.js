import { NotFoundError } from "../../../constants/customErrors.js";
import cartModel from "../../../models/cartModel.js";
import { getLatestCart } from "../../../services/user/getCart.js";

export const getCart = async(req, res, next) => {
    try {

        const userId = req.user?._id;
      
        const cart =await getLatestCart(userId)
        console.log(cart)
        if(!cart){
            throw new NotFoundError("Cart not found")
            
        }

        return res.status(200).json({success:true,message:"",cart:cart})
    } catch (error) {
        next(error);
    }
};
