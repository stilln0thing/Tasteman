/**
 * Payment service types - shared across Mock, Stripe, Razorpay
 */

export type PaymentProvider = "mock" | "stripe" | "razorpay";

export type CreatePaymentInput = {
  amount: number;        // in smallest currency unit (cents/paise) or as decimal
  currency: string;
  orderId: string;
  customerEmail: string;
  metadata?: Record<string, string>;
};

export type CreatePaymentResult = {
  success: boolean;
  paymentId?: string;
  clientSecret?: string;   // Stripe
  orderId?: string;        // Razorpay
  error?: string;
};

export type VerifyPaymentInput = {
  paymentId: string;
  provider: PaymentProvider;
  metadata?: Record<string, string>;
};

export type VerifyPaymentResult = {
  success: boolean;
  status: "paid" | "pending" | "failed";
  error?: string;
};
