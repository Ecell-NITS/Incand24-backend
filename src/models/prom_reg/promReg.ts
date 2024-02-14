import mongoose, { Document } from "mongoose";

type UserDocument = Document & {
  name: string;
  email: string;
  phone: number;
  partner: string;
  payment: string;
  role: string;
  registeredAt: string;
};

const PromSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  partner: {
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
  },
  payment: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "client",
  },
  registeredAt: {
    type: String,
  },
});

export const Prom = mongoose.model<UserDocument>("Prom", PromSchema);
