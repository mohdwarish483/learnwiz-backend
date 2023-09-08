import { instance } from "../server.js";
import { catchAsyncError } from "../middlewares/catchTryMIddleware.js";
import { userCollection } from "../models/UserModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { paymentCollection } from "../models/PaymentModel.js";

// buy subscription plan

export const buySubscription = catchAsyncError(async (req, res, next) => {
  const user = await userCollection.findById(req.user._id);

  if (user.role === "admin")
    return next(new ErrorHandler("Admin can't buy subscription", 400));

  const plan_id = process.env.SUBSCRIPTION_PLAN_ID || "plan_JuJevKAcuZdtRO";

  const subscription = await instance.subscriptions.create({
    plan_id,
    customer_notify: 1,
    total_count: 12,
  });

  user.subscription.id = subscription.id;

  user.subscription.status = subscription.status;

  await user.save();

  res.status(201).json({
    success: true,
    subscriptionId: subscription.id,
  });
});

// verify payment

export const paymentVerification = catchAsyncError(async (req, res, next) => {
  const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } =
    req.body;

  // user is a document of user collection

  const user = await userCollection.findById(req.user._id);

  const subscription_id = user.subscription.id;

  // creating hash based authentication code (HMAC) signature using sha algortithm and secret key on  the data payment id and subscription id

  // utf is input data character encoding
  // digest will complete hmac signature computation  and return a hmac signature in hex format
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
    .digest("hex");

  const isAuthentic = generated_signature === razorpay_signature;

  // if signature is not matching redirect to frontend payment failed url
  if (!isAuthentic)
    return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

  await paymentCollection.create({
    razorpay_signature,
    razorpay_payment_id,
    razorpay_subscription_id,
  });

  user.subscription.status = "active";

  await user.save();

  // redirecting to frontend url when payment gets successful with reference id

  res.redirect(
    `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
  );
});

// getRazor pay api key

export const getRazorpaykey = catchAsyncError(async (req, res, next) => {
  const razorpay_api_key = process.env.RAZORPAY_API_KEY;

  res.status(200).json({
    success: "true",
    key: razorpay_api_key,
  });
});

// cancel subscription

export const cancelSubscription = catchAsyncError(async (req, res, next) => {
  const user = await userCollection.findById(req.user._id);

  const subscriptionId = user.subscription.id;
  let refund = false;

  instance.subscriptions.cancel(subscriptionId);

  const payment = await paymentCollection.findOne({
    razorpay_subscription_id: subscriptionId,
  });

  const gap = Date.now() - payment.createdAt;

  // date.now() gives timestamp in milliseconds
  // multiply refund time by 1000
  const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

  if (refundTime > gap) {
    instance.payments.refund(payment.razorpay_payment_id);
    refund = true;
  }

  await payment.remove();
  user.subscription.id = undefined;
  user.subscription.status = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: refund
      ? "Subscription cancelled, You will receive full refund within 7 days."
      : "Subscription cancelled, But refund is not accepted as subscription was cancelled after 7 days." +
        `${process.env.FRONTEND_URL}\termsandcondition`,
  });
});
