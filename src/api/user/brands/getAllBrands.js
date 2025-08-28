import brandModel from "../../../models/brandModel.js"

export const getAllBrands = async(req,res,next)=>{
    try{
     const brands = await brandModel.find({});
     res.status(200).json({success:true,data:brands})
    }catch(error){
        next(error)
    }
}