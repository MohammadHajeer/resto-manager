import dotenv from "dotenv";
import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectToDatabase();
    
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
