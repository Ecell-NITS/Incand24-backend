import mongoose, { Document } from "mongoose";

type UserDocument = Document & {
  name: string;
  email: string;
  message: string;
  role: string;
  SentAt: string;
};

const ContactSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
  },
  role: {
    type: String,
    default: "client",
  },
  SentAt: {
    type: String,
  },
});

export const Contact = mongoose.model<UserDocument>("Contact", ContactSchema);
