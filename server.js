import mongoose from "mongoose";
import app from "./app.js";
import { getDbUrl, PORT } from "./src/utils/utils.js";

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

async function connectToDatabase() {
  try {
    const dbUrl = await getDbUrl({ useLocalDb: true });
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("ERROR CONNECTING TO DB! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1); // Exit process if DB connection fails
  }
}

async function startServer() {
  const port = PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Listening to requests on port ${port}`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

// Connect to DB and start the server
(async () => {
  await connectToDatabase();
  await startServer();
})();
