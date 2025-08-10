import userModel from '../models/userModel.js';
import tokenVerificationUtils from '../utils/tokenVerificationUtils.js';

const isLoggedIn = (roles = ['customer']) => async (req, res, next) => {
    
    const token = req.cookies.access_token;
  

    const verificationResult = tokenVerificationUtils.tokenVerification(token);

 
    try {

         let user=null;
         if(verificationResult.valid){

             user = await userModel.findById(verificationResult.decoded.id).select("-password -googleAccessToken -googleId");
         }

      

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Authentication error', error: err.message });
    }
};

export default isLoggedIn;