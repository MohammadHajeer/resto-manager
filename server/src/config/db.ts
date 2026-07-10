import mongoose from "mongoose";

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  // Fail fast with a clear message when MONGO_URI is missing, instead of
  // letting the driver attempt to connect with `undefined` and surface a
  // confusing low-level error.
  if (!mongoUri) {
    console.error(
      "Error connecting to MongoDB: MONGO_URI is not set. " +
        "Add MONGO_URI to your server/.env file (see server/.env.example).",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};

export { connectToDatabase };
