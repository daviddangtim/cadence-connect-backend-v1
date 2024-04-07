import app from "./app.js";
import { getDbUrl, PORT } from "./utils/utils.js";
import mongoose from "mongoose";

(async () => {
  try {
    const dbUrl = await getDbUrl({ useLocalDb: true });
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e.message);
  }
})();

const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to request on port ${port}`);
});
