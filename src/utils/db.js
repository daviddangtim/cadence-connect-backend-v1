import mongoose from "mongoose";

export default async (options = { local: true }) => {
  const { DATABASE, DATABASE_LOCAL, DATABASE_PASSWORD } = process.env;
  const url = options.local
    ? DATABASE_LOCAL
    : DATABASE.replace(/<PASSWORD>/g, DATABASE_PASSWORD);
  await mongoose.connect(url);
  console.log("Database connected successfully.");
};
