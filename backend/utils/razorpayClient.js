const Razorpay = require("razorpay");

let razorpayInstance;

function razorpayClient() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

module.exports = { razorpayClient };
