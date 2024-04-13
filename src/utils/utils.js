import dotenv from "dotenv";
import { v4 } from "uuid";

dotenv.config({ path: "./config.env" });

export const { PORT, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const { DATABASE, DATABASE_LOCAL, DATABASE_PASSWORD } = process.env;

export async function uuidV4() {
  return v4().replace(/-/g, "");
}

export async function getDbUrl(option = { useLocalDb: false }) {
  if (option.useLocalDb && !DATABASE_LOCAL) {
    throw new Error("Local database URL (DATABASE_LOCAL) is not defined.");
  } else if (!DATABASE) {
    throw new Error("Remote database URL (DATABASE) is not defined.");
  }
  return option.useLocalDb
    ? DATABASE_LOCAL
    : DATABASE.replace(/<PASSWORD>/g, DATABASE_PASSWORD);
}
