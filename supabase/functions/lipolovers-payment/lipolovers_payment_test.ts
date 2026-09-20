import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { digitsOnly, paymentWebhookSchema } from "./schema.ts";

Deno.test("aceita aviso de pagamento aprovado por e-mail", () => {
  const parsed = paymentWebhookSchema.safeParse({ event: "payment.approved", email: "Cliente@Exemplo.com", payment_id: "mp_123" });
  assertEquals(parsed.success, true);
  if (parsed.success) assertEquals(parsed.data.email, "cliente@exemplo.com");
});

Deno.test("recusa aviso sem identificador", () => {
  const parsed = paymentWebhookSchema.safeParse({ event: "payment.approved" });
  assertEquals(parsed.success, false);
});

Deno.test("recusa evento desconhecido", () => {
  const parsed = paymentWebhookSchema.safeParse({ event: "payment.created", email: "a@b.com" });
  assertEquals(parsed.success, false);
});

Deno.test("aceita estorno por token", () => {
  const parsed = paymentWebhookSchema.safeParse({ event: "payment.refunded", token: "a".repeat(64) });
  assertEquals(parsed.success, true);
});

Deno.test("normaliza telefone", () => {
  assertEquals(digitsOnly("+55 (71) 99999-8888"), "5571999998888");
});
