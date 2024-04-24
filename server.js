/* eslint-disable */
import dotenv from "dotenv/config";
import app from "./app.js";
import connectDb from "./src/utils/db.js";

process.on("uncaughtException", (err) => {
  console.error("💥💥💥 UNCAUGHT EXCEPTION! 💥 Shutting down... 💥💥💥");
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    const { PORT } = process.env;
    const port = PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`Listening to request on  http://127.0.0.1:${port}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("💥💥💥 UNHANDLED REJECTION! 💥 Shutting down... 💥💥💥");
      console.error(err.name, err.message, err.stack);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

(async () => {
  try {
    await connectDb({ local: true });
    await startServer();
  } catch (err) {
    console.error("💥💥💥 Error initializing server 💥💥💥");
    console.error(err.name, err.message);
    process.exit(1);
  }
})();
