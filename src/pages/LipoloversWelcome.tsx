import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, inputCls, STATES } from "@/components/affiliates/shared";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { LIPOLOVERS_CONFIG, type LipoloversFlavorId, type LipoloversPlanId } from "@/config/lipolovers";
import logo from "@/assets/logo-lipovitta.png";

const schema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome").max(120),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  phone: z.string().trim().min(8, "Informe seu WhatsApp").max(30),
  postal_code: z.string().trim().min(8, "Informe seu CEP").max(10),
  street_address: z.string().trim().min(2, "Informe seu endereço").max(200),
  address_number: z.string().trim().min(1, "Informe o número").max(30),
  complement: z.string().trim().max(120),
  neighborhood: z.string().trim().min(2, "Informe seu bairro").max(120),
  city: z.string().trim().min(2, "Informe sua cidade").max(120),
  state: z.string().length(2, "Escolha o estado"),
});

const emptyForm = { full_name: "", email: "", phone: "", postal_code: "", street_address: "", address_number: "", complement: "", neighborhood: "", city: "", state: "" };

export default function LipoloversWelcome() {
  const [token, setToken] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"checking" | "approved" | "pending" | "invalid">("checking");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selection, setSelection] = useState<{ plan: LipoloversPlanId; flavor: LipoloversFlavorId } | null>(null);

  const checkPayment = async (claimToken: string) => {
    setPaymentStatus("checking");
    const { data, error } = await supabase.functions.invoke("lipolovers-delivery", { body: { action: "status", token: claimToken } });
    if (error || data?.error) setPaymentStatus("invalid");
    else if (data?.payment_status === "approved") {
      setSelection({ plan: data.plan as LipoloversPlanId, flavor: data.flavor as LipoloversFlavorId });
      setPaymentStatus("approved");
    } else setPaymentStatus("pending");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const claimToken = params.get("token") ?? sessionStorage.getItem("lipolovers_claim_token") ?? "";
    setToken(claimToken);
    if (!claimToken) setPaymentStatus("invalid");
    else void checkPayment(claimToken);
  }, []);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { next[String(issue.path[0])] = issue.message; });
      setErrors(next);
      return;
    }
    setSaving(true);
    setMessage("");
    const { data, error } = await supabase.functions.invoke("lipolovers-delivery", { body: { action: "save", token, ...parsed.data } });
    setSaving(false);
    if (error || !data?.saved) {
      if (data?.payment_status !== "approved") setPaymentStatus("pending");
      setMessage("Não foi possível salvar agora. Confira o pagamento e tente novamente.");
      return;
    }
    setSaved(true);
    sessionStorage.removeItem("lipolovers_claim_token");
  };

  return <div className="min-h-screen bg-muted/30 text-foreground">
    <SEOHead title="Boas-vindas ao Lipolovers" description="Confirme seus dados para a entrega da sua assinatura Lipolovers." canonicalUrl="https://lipovitta.site/lipolovers/boas-vindas" />
    <header className="border-b border-border bg-background"><div className="container flex items-center justify-between px-4 py-3"><Link to="/"><img src={logo} alt="LipoVitta" className="h-9 w-auto" /></Link><Link to="/lipolovers" className="text-sm font-semibold text-primary">Conhecer o clube</Link></div></header>
    <main className="container max-w-3xl px-4 py-12 md:py-20">
      <div className="mb-9 text-center">
        <p className="text-sm font-bold uppercase text-accent">Clube de assinatura</p>
        <h1 className="mt-3 flex flex-wrap items-center justify-center gap-2 text-4xl font-extrabold text-primary sm:text-5xl">Bem-vinda ao Lipolovers <Heart className="h-9 w-9 fill-primary" aria-label="coração azul" /></h1>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">Sua assinatura foi iniciada. Agora precisamos confirmar seus dados para preparar sua entrega.</p>
      </div>

      {saved ? <div className="rounded-lg border border-accent/40 bg-background p-8 text-center shadow-sm"><CheckCircle2 className="mx-auto h-12 w-12 text-accent" /><h2 className="mt-4 text-2xl font-bold text-primary">Dados confirmados</h2><p className="mt-2 text-muted-foreground">Recebemos seus dados de entrega. Nossa equipe seguirá com a preparação do seu pedido.</p></div>
      : paymentStatus !== "approved" ? <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm">
          {paymentStatus === "checking" ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" /> : <Clock3 className="mx-auto h-10 w-10 text-accent" />}
          <h2 className="mt-4 text-xl font-bold text-primary">{paymentStatus === "checking" ? "Confirmando o pagamento" : paymentStatus === "pending" ? "Pagamento em processamento" : "Não encontramos esta confirmação"}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{paymentStatus === "pending" ? "Assim que o pagamento for aprovado, seus dados de entrega poderão ser confirmados aqui." : paymentStatus === "invalid" ? "Use o mesmo aparelho e navegador em que iniciou a assinatura ou retorne pelo link enviado após a compra." : "Isso pode levar alguns instantes."}</p>
          {token && paymentStatus !== "checking" && <Button onClick={() => void checkPayment(token)} className="mt-6 bg-primary hover:bg-primary/90">Verificar novamente</Button>}
        </div>
      : <form onSubmit={submit} className="space-y-5 rounded-lg border border-border bg-background p-5 shadow-sm sm:p-8" noValidate>
          {selection && <div className="grid gap-5 rounded-md bg-muted/50 p-4 sm:grid-cols-2">
            <div><p className="text-xs font-bold uppercase text-muted-foreground">Plano</p><p className="mt-1 font-semibold text-primary">{LIPOLOVERS_CONFIG.plans[selection.plan]?.name}</p></div>
            <div><p className="text-xs font-bold uppercase text-muted-foreground">Sabor escolhido</p><p className="mt-1 font-semibold text-primary">{LIPOLOVERS_CONFIG.flavors.find((flavor) => flavor.id === selection.flavor)?.label}</p></div>
          </div>}
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Nome" error={errors.full_name}><input value={form.full_name} onChange={update("full_name")} className={inputCls(errors.full_name)} autoComplete="name" /></Field><Field label="E-mail usado na assinatura" error={errors.email}><input value={form.email} onChange={update("email")} className={inputCls(errors.email)} type="email" autoComplete="email" /></Field></div>
          <div className="grid gap-5 sm:grid-cols-2"><Field label="WhatsApp" error={errors.phone}><input value={form.phone} onChange={update("phone")} className={inputCls(errors.phone)} type="tel" autoComplete="tel" /></Field><Field label="CEP" error={errors.postal_code}><input value={form.postal_code} onChange={update("postal_code")} className={inputCls(errors.postal_code)} inputMode="numeric" autoComplete="postal-code" /></Field></div>
          <div className="grid gap-5 sm:grid-cols-[1fr_140px]"><Field label="Endereço" error={errors.street_address}><input value={form.street_address} onChange={update("street_address")} className={inputCls(errors.street_address)} autoComplete="street-address" /></Field><Field label="Número" error={errors.address_number}><input value={form.address_number} onChange={update("address_number")} className={inputCls(errors.address_number)} /></Field></div>
          <Field label="Complemento (opcional)" error={errors.complement}><input value={form.complement} onChange={update("complement")} className={inputCls(errors.complement)} /></Field>
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Bairro" error={errors.neighborhood}><input value={form.neighborhood} onChange={update("neighborhood")} className={inputCls(errors.neighborhood)} /></Field><Field label="Cidade" error={errors.city}><input value={form.city} onChange={update("city")} className={inputCls(errors.city)} autoComplete="address-level2" /></Field></div>
          <Field label="Estado" error={errors.state}><select value={form.state} onChange={update("state")} className={inputCls(errors.state)} autoComplete="address-level1"><option value="">Selecione</option>{STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></Field>
          {message && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{message}</p>}
          <Button type="submit" size="lg" disabled={saving} className="w-full bg-accent font-bold hover:bg-accent/90">{saving && <Loader2 className="animate-spin" />}{saving ? "Salvando..." : "CONFIRMAR DADOS DE ENTREGA"}</Button>
        </form>}
    </main>
    <Footer />
  </div>;
}