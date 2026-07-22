import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/metaPixel";
import { STATES, NOTIFY_EMAIL, Field, inputCls, SuccessCard } from "@/pages/Afiliados";

const FOLLOWERS = [
  { value: "ate_1k", label: "Até 1.000" },
  { value: "1k_10k", label: "1.000 – 10.000" },
  { value: "10k_50k", label: "10.000 – 50.000" },
  { value: "50k_100k", label: "50.000 – 100.000" },
  { value: "100k_mais", label: "Mais de 100.000" },
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Nome muito curto").max(120),
  phone: z.string().trim().min(8, "Telefone inválido").max(30),
  email: z.string().trim().email("Email inválido").max(255),
  followers_range: z.enum(["ate_1k","1k_10k","10k_50k","50k_100k","100k_mais"], { errorMap: () => ({ message: "Selecione uma faixa" }) }),
  state: z.enum(STATES as [string, ...string[]], { errorMap: () => ({ message: "Selecione um estado" }) }),
  knows_product: z.enum(["sim","nao"], { errorMap: () => ({ message: "Responda sim ou não" }) }),
});

type FormState = {
  full_name: string;
  phone: string;
  email: string;
  followers_range: string;
  state: string;
  knows_product: string;
};

const initialState: FormState = {
  full_name: "",
  phone: "",
  email: "",
  followers_range: "",
  state: "",
  knows_product: "",
};

const AffiliateForm = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setServerError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email.toLowerCase(),
      followers_range: parsed.data.followers_range,
      state: parsed.data.state,
      knows_product: parsed.data.knows_product === "sim",
    };

    const { data: inserted, error } = await supabase
      .from("affiliate_applications")
      .insert(payload)
      .select("id, created_at")
      .single();

    if (error) {
      setSubmitting(false);
      setServerError("Não foi possível enviar. Tente novamente em instantes.");
      return;
    }

    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "new-affiliate-application",
          recipientEmail: NOTIFY_EMAIL,
          idempotencyKey: `affiliate-${inserted.id}`,
          templateData: {
            fullName: payload.full_name,
            phone: payload.phone,
            email: payload.email,
            followersRange: payload.followers_range,
            state: payload.state,
            knowsProduct: payload.knows_product,
            submittedAt: new Date(inserted.created_at).toLocaleString("pt-BR"),
          },
        },
      });
    } catch {
      /* silent */
    }

    trackEvent(
      "Lead",
      { content_name: "afiliada", content_category: "afiliados" },
      { eventID: `affiliate-${inserted.id}` }
    );

    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <SuccessCard
        title="Recebemos seu cadastro"
        message="Nossa equipe entrará em contato pelo WhatsApp em breve."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
      <Field label="Nome completo" error={errors.full_name}>
        <input type="text" value={form.full_name} onChange={update("full_name")} className={inputCls(errors.full_name)} placeholder="Seu nome" autoComplete="name" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="WhatsApp" error={errors.phone}>
          <input type="tel" value={form.phone} onChange={update("phone")} className={inputCls(errors.phone)} placeholder="(11) 99999-0000" autoComplete="tel" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={update("email")} className={inputCls(errors.email)} placeholder="voce@email.com" autoComplete="email" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Quantidade de seguidores" error={errors.followers_range}>
          <select value={form.followers_range} onChange={update("followers_range")} className={inputCls(errors.followers_range)}>
            <option value="">Selecione</option>
            {FOLLOWERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Estado" error={errors.state}>
          <select value={form.state} onChange={update("state")} className={inputCls(errors.state)}>
            <option value="">UF</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Já conhece o LipoVitta?" error={errors.knows_product}>
        <div className="flex gap-3">
          {[{ v: "sim", l: "Sim" }, { v: "nao", l: "Ainda não" }].map((opt) => (
            <label
              key={opt.v}
              className={`flex-1 cursor-pointer border rounded-lg px-4 py-3 text-sm font-medium text-center transition-colors ${
                form.knows_product === opt.v
                  ? "border-[#4667B4] bg-[#4667B4]/5 text-[#4667B4]"
                  : "border-border text-foreground hover:border-[#4667B4]/40"
              }`}
            >
              <input type="radio" name="knows_product" value={opt.v} checked={form.knows_product === opt.v} onChange={update("knows_product")} className="sr-only" />
              {opt.l}
            </label>
          ))}
        </div>
      </Field>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full font-bold text-white text-sm md:text-base rounded-full py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#9BAE52" }}
      >
        {submitting ? "Enviando..." : "Quero ser afiliada"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Ao enviar, você concorda em ser contatada pela nossa equipe.
      </p>
    </form>
  );
};

export default AffiliateForm;
