import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import RazorPay from "razorpay";
import NodeCron from "node-cron";
import { statsCollection } from "./models/StatsModel.js";

connectDB();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// RazorPay api

export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// nodecron for scheduling
// every 1st of month
NodeCron.schedule("0 0 0 1 * *", async () => {
  try {
    await statsCollection.create({});
  } catch (error) {
    // console.log(error);
  }
});

// setting up server
app.listen(process.env.PORT, () => {
  console.log(
    `The server is working and is running on port : ${process.env.PORT}`
  );
});
