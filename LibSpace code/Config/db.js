import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (err) {
    console.error("Error while connecting to MongoDB", err);
    process.exit(1); // exit if DB connection fails
  }
};

export default connectDb;