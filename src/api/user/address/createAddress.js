import { addressValidationSchema } from "../../../validators/addressValidation.js"

export const createAddress =async (req,res,next)=>{
    try{

        addressValidationSchema.parse()

    }catch(error){
        next(error)
    }
}