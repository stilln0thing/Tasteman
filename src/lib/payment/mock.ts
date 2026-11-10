/**
 * Mock Payment Provider - for development and testing
 * Simulates successful payment after a short delay
 * Replace with stripe.ts or razorpay.ts in production
 */

import type { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";

export async function createMockPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  // Simulate API call delay
  await new Promise((r) => setTimeout(r, 500));
  const paymentId = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return {
    success: true,
    paymentId,
    clientSecret: `mock_secret_${paymentId}`,
  };
}

export async function verifyMockPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
  await new Promise((r) => setTimeout(r, 200));
  if (input.paymentId.startsWith("mock_")) {
    return { success: true, status: "paid" };
  }
  return { success: false, status: "failed", error: "Invalid mock payment ID" };
}
