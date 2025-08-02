// // Import modules using ES6 syntax
// import twilio from 'twilio';
// import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../../config/index.js';

// // Twilio credentials
// const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// // Express route handler
// const verification = async (req, res) => {
//     try {

//         const phoneNumber="+919048197645"
//         if (!phoneNumber) {
//             return res.status(400).json({ error: 'Phone number is required' });
//         }

//         const message = await client.messages.create({
//             body: 'Hello from Twilio via Node.js!',
//             from: '+12792403518', // Your Twilio number
//             to: phoneNumber       // Recipient's number
//         });

//         console.log('Message sent! SID:', message.sid);
//         res.status(200).json({ success: true, sid: message.sid });

//     } catch (error) {
//         console.error('Error sending SMS:', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Export using ES6 syntax
// export { verification };




// Import Twilio credentials
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } from '../config/index.js';

// Import and initialize Twilio client correctly
import twilio from 'twilio';
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Send OTP via SMS
const verification = async (req, res) => {
    try {
        const phoneNumber = "9048197645";

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        const verification = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications.create({
                to: `+91${phoneNumber}`,
                channel: 'sms',
        });

        res.status(200).json({ success: true, sid: verification.sid });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const phoneNumber = "9048197645";
        const otp = req.query.otp;

        console.log("Received OTP from query:", otp);

        if (!otp || typeof otp !== 'string' || otp.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'OTP is required' });
        }

        const verificationCheck = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `+91${phoneNumber}`,
                code: otp.trim(),
            });

        if (verificationCheck.status === "approved") {
            return res.status(200).json({ success: true, message: 'OTP verified successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};


// Correct export syntax
export { verification, verifyOTP };
