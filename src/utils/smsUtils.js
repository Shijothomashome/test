import client from '../config/twilioClient.js';
import {
  TWILIO_SERVICE_SID,
  TWILIO_PHONE_NUMBER,
  APP_NAME
} from '../config/index.js';
import { generateOtp, otpMessageTemplate } from './otpUtils.js';

// Send OTP via Twilio Verify service
const sendSmsOtp = async (phoneNumber) => {
  try {
    if (!phoneNumber) return { valid: false, error: 'Phone number is required to send an OTP.' };

    const verification = await client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create({
      to: `+91${phoneNumber}`,
      channel: 'sms',
    });

    return {
      valid: true,
      sid: verification.sid,
      message: 'OTP has been sent to your mobile number.',
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { valid: false, error: 'Failed to send OTP. Please try again later.' };
  }
};

// Verify OTP using Twilio Verify
const verifySmsOtp = async (phoneNumber, otp) => {
  try {
    if (!otp || otp.trim().length !== 6) return { valid: false, error: 'Please enter a valid 6-digit OTP.' };
    if (!phoneNumber) return { valid: false, error: 'Phone number is required to verify the OTP.' };

    const verificationCheck = await client.verify.v2.services(TWILIO_SERVICE_SID).verificationChecks.create({
      to: `+91${phoneNumber}`,
      code: otp.trim(),
    });

    if (verificationCheck.status === 'approved') {
      return { valid: true, message: 'OTP verification successful.' };
    } else {
      return { valid: false, message: 'The OTP is incorrect or has expired.' };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { valid: false, error: 'Failed to verify OTP. Please try again later.' };
  }
};

// Send normal SMS (non-OTP)
const sendSms = async (phoneNumber, content, value) => {
  try {
    if (!phoneNumber) return { valid: false, error: 'Phone number is required to send a message.' };

    const message = await client.messages.create({
      body: content,
      from: TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });

    console.log('Message sent! SID:', message.sid);
    return {
      valid: true,
      sid: message.sid,
      message: 'Message sent successfully.',
      body: message.body,
      value,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { valid: false, error: 'Failed to send message. Please try again later.' };
  }
};

// Send OTP manually (custom flow)
const sendSmsOtpManually = async (phoneNumber) => {
  const otp = generateOtp(6);
  const result = await sendSms(phoneNumber, otpMessageTemplate(otp));
  return { ...result, otp };
};

export default{
  sendSmsOtp,
  verifySmsOtp,
  sendSms,
  sendSmsOtpManually
};