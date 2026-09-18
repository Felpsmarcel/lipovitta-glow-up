import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { deliverySchema, leadSchema, tagsFor } from "../_shared/lipolovers.ts";

Deno.test("accepts an allowed Lipolovers lead", () => {
  const result = leadSchema.safeParse({ full_name: "Maria Silva", phone: "71999999999", email: "MARIA@example.com", plan: "master", flavor: "limao" });
  assertEquals(result.success, true);
  if (result.success) assertEquals(result.data.email, "maria@example.com");
});

Deno.test("builds only the approved GHL tags", () => {
  assertEquals(tagsFor("essencial", "abacaxi"), ["lipolovers-interesse", "lipolovers-essencial", "sabor-abacaxi"]);
});

Deno.test("delivery data is required only when saving", () => {
  assertEquals(deliverySchema.safeParse({ action: "status", token: "a".repeat(32) }).success, true);
  assertEquals(deliverySchema.safeParse({ action: "save", token: "a".repeat(32) }).success, false);
});