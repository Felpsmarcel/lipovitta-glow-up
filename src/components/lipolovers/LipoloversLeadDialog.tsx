import { useEffect, useRef, useState } from "react";
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
import { LIPOLOVERS_CONFIG, LIPOLOVERS_GIFTS, type LipoloversFlavorId } from "@/config/lipolovers";
import { trackInitiateCheckout, trackLead } from "@/lib/tracking";

const schema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome").max(120),
  phone: z.string().trim().min(8, "Informe um WhatsApp válido").max(30),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  flavor: z.enum(["tangerina", "limao", "abacaxi"], { errorMap: () => ({ message: "Escolha um sabor" }) }),
});

type Props = {
  open: boolean;
  initialFlavor?: LipoloversFlavorId;
  onOpenChange: (open: boolean) => void;
};

export default function LipoloversLeadDialog({ open, initialFlavor, onOpenChange }: Props) {
  const plan = LIPOLOVERS_CONFIG.plans.essencial;
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", flavor: initialFlavor ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({});

  useEffect(() => {
    if (!open) return;
    setForm((current) => ({ ...current, flavor: initialFlavor ?? "" }));
    setErrors({});
    setServerError("");
    setCheckoutUrl("");
  }, [open, initialFlavor]);

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
      const firstInvalidField = String(parsed.error.issues[0]?.path[0] ?? "");
      window.setTimeout(() => fieldRefs.current[firstInvalidField]?.focus(), 0);
      return;
    }
    setSubmitting(true);
    setServerError("");
    const { data, error } = await supabase.functions.invoke("lipolovers-lead", {
      body: { ...parsed.data, plan: "essencial" },
    });
    if (error || !data?.event_id || !data?.claim_token) {
      setSubmitting(false);
      setServerError("Não foi possível continuar agora. Tente novamente em instantes.");
      return;
    }
    sessionStorage.setItem("lipolovers_claim_token", String(data.claim_token));
    trackLead({ formName: "site-lipolovers", eventId: `lead-${data.event_id}`, value: plan.price });
    const flavorLabel = LIPOLOVERS_CONFIG.flavors.find((flavor) => flavor.id === parsed.data.flavor)?.label ?? parsed.data.flavor;
    trackInitiateCheckout({
      eventId: data.event_id,
      location: "lipolovers-essencial",
      productName: plan.name,
      value: plan.price,
      flavor: flavorLabel,
    });
    // O link curto do Mercado Pago descarta query params; a atribuição fica no lead salvo.
    const url = plan.checkoutUrl;
    setCheckoutUrl(url);
    setSubmitting(false);
    const opened = window.open(url, "_blank");
    if (!opened) {
      try {
        (window.top ?? window).location.href = url;
      } catch {
        /* popup bloqueado e navegação do topo negada: o link manual abaixo resolve */
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={submitting ? undefined : onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg border-border p-5 sm:p-7">
        <DialogHeader className="pr-6 text-left">
          <p className="text-xs font-bold uppercase text-accent">Resumo da assinatura</p>
          <DialogTitle className="text-2xl text-primary">{plan.name}</DialogTitle>
          <DialogDescription>Revise sua escolha e informe seus dados para seguir ao pagamento.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border border-border bg-muted/35 p-4 text-sm">
          <span className="text-muted-foreground">Mensalidade</span><strong className="text-right text-primary">R$ {plan.price}/mês</strong>
          <span className="text-muted-foreground">Compromisso</span><strong className="text-right">{LIPOLOVERS_CONFIG.commitmentMonths} meses</strong>
          <span className="text-muted-foreground">Inclui</span><strong className="text-right">{plan.includes.length} produtos + {LIPOLOVERS_GIFTS.length} brindes</strong>
          <span className="text-muted-foreground">Sabor</span><strong className="text-right">{LIPOLOVERS_CONFIG.flavors.find((flavor) => flavor.id === initialFlavor)?.label ?? "Escolha abaixo"}</strong>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Nome" error={errors.full_name}>
            <input ref={(element) => { fieldRefs.current.full_name = element; }} value={form.full_name} onChange={update("full_name")} className={inputCls(errors.full_name)} autoComplete="name" placeholder="Seu nome completo" />
          </Field>
          <Field label="WhatsApp" error={errors.phone}>
            <input ref={(element) => { fieldRefs.current.phone = element; }} value={form.phone} onChange={update("phone")} className={inputCls(errors.phone)} type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
          </Field>
          <Field label="E-mail" error={errors.email}>
            <input ref={(element) => { fieldRefs.current.email = element; }} value={form.email} onChange={update("email")} className={inputCls(errors.email)} type="email" autoComplete="email" placeholder="voce@email.com" />
          </Field>
          <Field label="Plano escolhido">
            <input value={`${plan.name} — R$${plan.price}/mês`} className={inputCls()} readOnly aria-readonly="true" />
          </Field>
          <Field label="Sabor do Shot Matinal" error={errors.flavor}>
            <select ref={(element) => { fieldRefs.current.flavor = element; }} value={form.flavor} onChange={update("flavor")} className={inputCls(errors.flavor)}>
              <option value="">Escolha o sabor</option>
              {LIPOLOVERS_CONFIG.flavors.map((flavor) => <option value={flavor.id} key={flavor.id}>{flavor.label}</option>)}
            </select>
          </Field>
          {serverError && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}
          {checkoutUrl ? (
            <div className="space-y-2 rounded-md border border-accent/40 bg-accent/10 p-4 text-sm">
              <p className="font-semibold text-primary">Abrimos o pagamento em uma nova aba.</p>
              <p className="text-muted-foreground">Se ela não abrir, toque no botão abaixo.</p>
              <Button asChild size="lg" className="w-full bg-accent font-bold hover:bg-accent/90">
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">ABRIR PAGAMENTO — R$ {plan.price}/MÊS</a>
              </Button>
            </div>
          ) : (
            <Button type="submit" size="lg" disabled={submitting} className="w-full bg-accent font-bold hover:bg-accent/90">
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "Salvando..." : `CONTINUAR PARA O PAGAMENTO — R$ ${plan.price}/MÊS`}
            </Button>
          )}
          <p className="text-center text-xs leading-relaxed text-muted-foreground">O pagamento acontece na próxima etapa, em ambiente seguro. Frete calculado à parte. Após {LIPOLOVERS_CONFIG.commitmentMonths} meses você pode cancelar para as próximas cobranças.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
