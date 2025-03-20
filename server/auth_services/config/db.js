require("dotenv").config();
const mongoose = require("mongoose");


const connectDb = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_AUTH_URI)
      .then(() => {
        console.log("Connected to MongoDB auth service");
      })
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = { connectDb };
