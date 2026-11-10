/**
 * Payment Service - centralized entry point
 * Switch provider via env: PAYMENT_PROVIDER=mock|stripe|razorpay
 * 
 * To add real payments later:
 * 1. Set STRIPE_SECRET_KEY or RAZORPAY_KEY_SECRET in .env
 * 2. Set PAYMENT_PROVIDER=stripe or razorpay
 * 3. Implement stripe.ts / razorpay.ts using same types
 */

import type { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";
import { createMockPayment, verifyMockPayment } from "./mock";

const PROVIDER = (process.env.PAYMENT_PROVIDER || "mock") as "mock" | "stripe" | "razorpay";

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  switch (PROVIDER) {
    case "stripe":
      // const { createStripePayment } = await import("./stripe");
      // return createStripePayment(input);
      // Fallback to mock if stripe not implemented
    case "razorpay":
      // const { createRazorpayPayment } = await import("./razorpay");
      // return createRazorpayPayment(input);
    default:
      return createMockPayment(input);
  }
}

export async function verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
  switch (PROVIDER) {
    case "stripe":
      // return verifyStripePayment(input);
    case "razorpay":
      // return verifyRazorpayPayment(input);
    default:
      return verifyMockPayment(input);
  }
}
