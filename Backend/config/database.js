import mongoose from "mongoose";

// Connects to MongoDB using URI from .env
const connectToDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectToDB;
