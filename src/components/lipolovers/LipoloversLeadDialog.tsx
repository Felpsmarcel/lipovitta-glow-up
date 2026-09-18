import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, inputCls } from "@/components/affiliates/shared";
import { supabase } from "@/integrations/supabase/client";
import { LIPOLOVERS_CONFIG, type LipoloversFlavorId, type LipoloversPlanId } from "@/config/lipolovers";
import { trackInitiateCheckout, trackLead } from "@/lib/tracking";

const schema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome").max(120),
  phone: z.string().trim().min(8, "Informe um WhatsApp válido").max(30),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  flavor: z.enum(["tangerina", "limao", "abacaxi"], { errorMap: () => ({ message: "Escolha um sabor" }) }),
});

type Props = {
  open: boolean;
  planId: LipoloversPlanId;
  initialFlavor?: LipoloversFlavorId;
  onOpenChange: (open: boolean) => void;
};

export default function LipoloversLeadDialog({ open, planId, initialFlavor, onOpenChange }: Props) {
  const plan = LIPOLOVERS_CONFIG.plans[planId];
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", flavor: initialFlavor ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm((current) => ({ ...current, flavor: initialFlavor ?? "" }));
    setErrors({});
    setServerError("");
  }, [open, initialFlavor, planId]);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { next[String(issue.path[0])] = issue.message; });
      setErrors(next);
      return;
    }
    setSubmitting(true);
    setServerError("");
    const { data, error } = await supabase.functions.invoke("lipolovers-lead", {
      body: { ...parsed.data, plan: planId },
    });
    if (error || !data?.checkout_url || !data?.event_id || !data?.claim_token) {
      setSubmitting(false);
      setServerError("Não foi possível continuar agora. Tente novamente em instantes.");
      return;
    }
    sessionStorage.setItem("lipolovers_claim_token", String(data.claim_token));
    trackLead({ formName: "site-lipolovers", eventId: `lead-${data.event_id}`, value: plan.price });
    const flavorLabel = LIPOLOVERS_CONFIG.flavors.find((flavor) => flavor.id === parsed.data.flavor)?.label ?? parsed.data.flavor;
    trackInitiateCheckout({
      eventId: data.event_id,
      location: `lipolovers-${planId}`,
      productName: plan.name,
      value: plan.price,
      flavor: flavorLabel,
    });
    window.location.assign(data.checkout_url);
  };

  return (
    <Dialog open={open} onOpenChange={submitting ? undefined : onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg border-border p-5 sm:p-7">
        <DialogHeader className="pr-6 text-left">
          <p className="text-xs font-bold uppercase text-accent">Seu plano</p>
          <DialogTitle className="text-2xl text-primary">{plan.name}</DialogTitle>
          <DialogDescription>Conte como podemos falar com você e escolha seu sabor antes de seguir.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Nome" error={errors.full_name}>
            <input value={form.full_name} onChange={update("full_name")} className={inputCls(errors.full_name)} autoComplete="name" placeholder="Seu nome completo" />
          </Field>
          <Field label="WhatsApp" error={errors.phone}>
            <input value={form.phone} onChange={update("phone")} className={inputCls(errors.phone)} type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
          </Field>
          <Field label="E-mail" error={errors.email}>
            <input value={form.email} onChange={update("email")} className={inputCls(errors.email)} type="email" autoComplete="email" placeholder="voce@email.com" />
          </Field>
          <Field label="Plano escolhido">
            <input value={`${plan.name} — R$${plan.price}/mês`} className={inputCls()} readOnly aria-readonly="true" />
          </Field>
          <Field label="Sabor do Shot Matinal" error={errors.flavor}>
            <select value={form.flavor} onChange={update("flavor")} className={inputCls(errors.flavor)}>
              <option value="">Escolha o sabor</option>
              {LIPOLOVERS_CONFIG.flavors.map((flavor) => <option value={flavor.id} key={flavor.id}>{flavor.label}</option>)}
            </select>
          </Field>
          {serverError && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}
          <Button type="submit" size="lg" disabled={submitting} className="w-full bg-accent font-bold hover:bg-accent/90">
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? "Salvando..." : "CONTINUAR PARA O PAGAMENTO"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Você seguirá para o checkout seguro. Frete calculado à parte.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}