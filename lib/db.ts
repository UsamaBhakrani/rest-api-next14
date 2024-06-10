import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting DB...");
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "next14restapi",
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (error) {
    console.log(Error);
    throw new Error("Error");
  }
};
