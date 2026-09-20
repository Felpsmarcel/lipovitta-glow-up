import { z } from "npm:zod@^3.25.76";

export const paymentWebhookSchema = z.object({
  event: z.enum(["payment.approved", "payment.refunded", "subscription.cancelled"]),
  token: z.string().trim().min(32).max(200).optional(),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()).optional(),
  phone: z.string().trim().min(8).max(30).optional(),
  payment_id: z.string().trim().min(1).max(120).optional(),
  paid_at: z.string().datetime().optional(),
}).refine((data) => Boolean(data.token || data.email || data.phone), {
  message: "Informe token, email ou phone",
  path: ["email"],
});

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}
