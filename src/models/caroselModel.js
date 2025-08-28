import mongoose from "mongoose";

const caroselSchema = new mongoose.Schema({
    isActive:{type:Boolean,defaut:false,required:true},
    image:{type:String,required:true},
    collectionId:{type:mongoose.Schema.Types.ObjectId,ref:'Collection'},
    collectionHandle:{type:String,required:true,},
    collectionTitle:{type:String,reqired:true}
},{timestamps:true})

export default mongoose.model("Carousel",caroselSchema);