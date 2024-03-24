import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to request on port ${port}`);
});
