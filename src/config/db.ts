import mongoose from "mongoose";
import { CError, CSuccess } from "../utils/ChalkCustomStyles";

const connectToDb = async () => {
  try {
    const mongodbUrl = process.env.MONGODB_URL;

    if (!mongodbUrl) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }
    CSuccess("trying to connect to db");
    await mongoose.connect(mongodbUrl);

    CSuccess("MongoDB database connected successfully");
  } catch (error) {
    CError(
      `Establishing connection to the database encountered an error: ${error}`
    );
  }
};

export default connectToDb;
