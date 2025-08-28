import Collection from "../../../models/collectionModel.js"

export const getAllCollections = async(req,res,next)=>{
    try{
       
        const collections= await Collection.aggregate([{$match:{}},{$project:{_id:1,title:1,handle:1}}]);
        return res.status(200).json({success:true,message:"",data:collections})
    }catch(error){
        next(error)
    }
}