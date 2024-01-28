import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  buySubscription,
  cancelSubscription,
  getRazorpaykey,
  paymentVerification,
} from "../controllers/paymentController.js";

const router = express.Router();

// subscription plan and cancel plan

router.route("/subscribe").get(isAuthenticated, buySubscription);
router.route("/subscribe/cancel").get(isAuthenticated, cancelSubscription);

// payment verification

router.route("/paymentverification").post(isAuthenticated, paymentVerification);
// get razorpay api key

router.route("/razorpaykey").get(isAuthenticated, getRazorpaykey);

export default router;
