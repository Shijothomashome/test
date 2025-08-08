import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";
import s3Utils from "../../../utils/s3Utils.js";
export const deleteProductSubImage = async(req, res, next) => {
    try {
        const { productId } = req.params;
      
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError("Invalid product Id");
        }
        const {imageUrl} = req.query;
        console.log(imageUrl)
        if(!imageUrl) throw new NotFoundError("Invalid image URL");
        const product =  await productModel.findOne({_id:productId})
        if(!product){
            throw new NotFoundError("Product not found")
        }

       const isDeleted =  await s3Utils.deleteFromS3(imageUrl);
       if(isDeleted){
        product.images = product.images.filter((image)=>image!==imageUrl);
       }else{
        throw new BadRequestError("Something went wrong. Image not removed")
       }
       await product.save()
       res.status(200).json({success:true,message:"Product images successfully deleted",images:product.images})
    } catch (error) {
        next(error);
    }
};
