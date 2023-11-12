import mongoose, { Document } from "mongoose";

type UserDocument = Document & {
  eventName: string;
  leaderName: string;
  teamName: string;
  members: [string];
  // isGroupEvent: boolean;
  registeredAt: string;
  soloParticipantName: string | undefined;
};

const EventRegistrationSchema = new mongoose.Schema<UserDocument>({
  eventName: String,
  leaderName: String,
  teamName: String,
  members: [String],
  // isGroupEvent: Boolean,
  registeredAt: String,
  soloParticipantName: String,
});

export const Event = mongoose.model<UserDocument>(
  "EventRegistration",
  EventRegistrationSchema
);
