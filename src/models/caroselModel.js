import mongoose from "mongoose";

const caroselSchema = new mongoose.Schema({
    isActive:{type:Boolean,defaut:false,required:true},
    image:{type:String,required:true}
},{timestamps:true})

export default mongoose.model("Carousel",caroselSchema);