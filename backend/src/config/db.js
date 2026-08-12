import mongoose from "mongoose";

export default async function db(){
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database is connected");

  } catch (error) {
    console.log("database is not connected");
  }
}