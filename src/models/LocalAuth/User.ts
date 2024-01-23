import mongoose, { Document } from "mongoose";

type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  role: string;
  deleteAccount: boolean;
  token: string | undefined;
  tokenExpiresAt: string | undefined;
  isVerified: boolean;
  is2faEnabled: boolean;
  whichEventHead: string[]; // array of strings
  registrationInvite: // array of objects
  {
    eventName: string;
    teamName: string;
    teamMembers: Array<string>;
  }[];
  inviteLink: {
    // array of objects
    leaderEmail: string | undefined;
    eventName: string | undefined;
    teamName: string | undefined;
    expiresAt: string | undefined;
    uniqueToken: string | undefined;
  }[];
};

const userSchema = new mongoose.Schema<UserDocument>({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: "client",
  },
  password: {
    type: String,
    required: true,
  },
  deleteAccount: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: undefined,
  },
  whichEventHead: {
    type: [String],
  },
  tokenExpiresAt: {
    type: String,
    default: undefined,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  is2faEnabled: {
    type: Boolean,
    default: false,
  },
  registrationInvite: [
    {
      //array of objects
      eventName: String,
      teamName: String,
      teamMembers: [String],
    },
  ],
  inviteLink: [
    {
      //array of objects
      leaderEmail: { type: String },
      teamName: { type: String },
      eventName: { type: String },
      uniqueToken: { type: String },
      expiresAt: { type: String },
    },
  ],
});

export const User = mongoose.model<UserDocument>(
  "localAuthenticationSignup",
  userSchema
);
