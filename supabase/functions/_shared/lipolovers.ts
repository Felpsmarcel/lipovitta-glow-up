import { z } from "npm:zod@^3.25.76";

// Apenas Essencial é vendido atualmente; Master fica como legado no banco.
export const planSchema = z.enum(["essencial"]);

export const flavorSchema = z.enum(["tangerina", "limao", "abacaxi"]);

export const leadSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  plan: planSchema,
  flavor: flavorSchema,
});

export const deliverySchema = z.object({
  action: z.enum(["status", "save"]),
  token: z.string().min(32).max(200),
  full_name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()).optional(),
  phone: z.string().trim().min(8).max(30).optional(),
  postal_code: z.string().trim().min(8).max(10).optional(),
  street_address: z.string().trim().min(2).max(200).optional(),
  address_number: z.string().trim().min(1).max(30).optional(),
  complement: z.string().trim().max(120).optional(),
  neighborhood: z.string().trim().min(2).max(120).optional(),
  city: z.string().trim().min(2).max(120).optional(),
  state: z.string().trim().regex(/^[A-Za-z]{2}$/).transform((value) => value.toUpperCase()).optional(),
}).superRefine((data, ctx) => {
  if (data.action !== "save") return;
  for (const field of ["full_name", "email", "phone", "postal_code", "street_address", "address_number", "neighborhood", "city", "state"] as const) {
    if (!data[field]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: "Campo obrigatório" });
  }
});

export function tagsFor(plan: z.infer<typeof planSchema>, flavor: z.infer<typeof flavorSchema>): string[] {
  return ["lipolovers-interesse", `lipolovers-${plan}`, `sabor-${flavor}`];
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}