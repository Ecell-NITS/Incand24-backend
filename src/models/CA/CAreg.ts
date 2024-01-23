import mongoose, { Document } from "mongoose";

type UserDocument = Document & {
  name: string;
  email: string;
  phone: number;
  college: string;
};

const CARegistrationSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  college: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
    length: 10,
  },
});

export const CAreg = mongoose.model<UserDocument>(
  "CAreg",
  CARegistrationSchema
);
