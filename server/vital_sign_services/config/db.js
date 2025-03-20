require("dotenv").config();
const mongoose = require("mongoose");


const connectDb = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_VITALS_URI)
      .then(() => {
        console.log("Connected to MongoDB vitals service");
      })
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = { connectDb };