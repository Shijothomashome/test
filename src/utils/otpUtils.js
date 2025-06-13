

// Generate random OTP
export const generateOtp = (digit = 6) => {
  const min = Math.pow(10, digit - 1);
  const max = Math.pow(10, digit) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Template for OTP message
export const otpMessageTemplate = (otp) => {
  return `Your verification code is ${otp}. Please do not share it with anyone.`;
};
