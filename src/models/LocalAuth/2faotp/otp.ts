import mongoose, { Document } from "mongoose";

type UserDocument = Document & {
  email: string;
  otp: string | undefined;
  otpExpiresAt: string | undefined;
};

const twoFaSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    default: undefined,
  },
  otpExpiresAt: {
    type: String,
    default: undefined,
  },
});

export const twoFA = mongoose.model<UserDocument>("2fa", twoFaSchema);
