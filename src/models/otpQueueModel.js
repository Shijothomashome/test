import mongoose from 'mongoose';

const otpQueueSchema = new mongoose.Schema(
  {
    to: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    contact: {
      type: String,
    },
    purpose: {
      type: String,
      enum: ['login-email', 'login-phone', 'reset-password', 'verify-email', 'verify-phone'],
      required: true,
      default: 'login-email',
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), 
    },
  },
  {
    timestamps: true,
  }
);

// TTL index for automatic deletion
otpQueueSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('OtpQueue', otpQueueSchema);
