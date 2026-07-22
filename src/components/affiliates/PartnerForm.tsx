import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { STATES, NOTIFY_EMAIL, Field, inputCls, SuccessCard } from "@/pages/Afiliados";

const BUSINESS_TYPES = [
  "Farmácia",
  "Clínica estética",
  "Nutricionista",
  "Personal trainer",
  "Loja de suplementos",
  "Outro",
];

const maskCnpj = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const isValidCnpj = (cnpj: string) => {
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (base: string, weights: number[]) => {
    const sum = weights.reduce((acc, w, i) => acc + parseInt(base[i]) * w, 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const w1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  const dv1 = calc(d.slice(0, 12), w1);
  const dv2 = calc(d.slice(0, 12) + dv1, w2);
  return dv1 === parseInt(d[12]) && dv2 === parseInt(d[13]);
};

const schema = z.object({
  responsible_name: z.string().trim().min(2, "Nome muito curto").max(120),
  phone: z.string().trim().min(8, "Telefone inválido").max(30),
  email: z.string().trim().email("Email inválido").max(255),
  cnpj: z.string().trim().refine(isValidCnpj, { message: "CNPJ inválido" }),
  company_name: z.string().trim().min(2, "Razão social muito curta").max(200),
  business_type: z.enum(BUSINESS_TYPES as [string, ...string[]], { errorMap: () => ({ message: "Selecione o tipo" }) }),
  city: z.string().trim().min(2, "Cidade inválida").max(120),
  state: z.enum(STATES as [string, ...string[]], { errorMap: () => ({ message: "UF" }) }),
  volume_notes: z.string().trim().max(600).optional().or(z.literal("")),
});

type FormState = {
  responsible_name: string;
  phone: string;
  email: string;
  cnpj: string;
  company_name: string;
  business_type: string;
  city: string;
  state: string;
  volume_notes: string;
};

const initialState: FormState = {
  responsible_name: "",
  phone: "",
  email: "",
  cnpj: "",
  company_name: "",
  business_type: "",
  city: "",
  state: "",
  volume_notes: "",
};

const PartnerForm = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update =
    (k: keyof FormState, transform?: (v: string) => string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const v = transform ? transform(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [k]: v }));
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
      responsible_name: parsed.data.responsible_name,
      phone: parsed.data.phone,
      email: parsed.data.email.toLowerCase(),
      cnpj: parsed.data.cnpj,
      company_name: parsed.data.company_name,
      business_type: parsed.data.business_type,
      city: parsed.data.city,
      state: parsed.data.state,
      volume_notes: parsed.data.volume_notes || null,
    };

    const { data: inserted, error } = await supabase
      .from("commercial_partner_applications")
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
          templateName: "new-commercial-partner-application",
          recipientEmail: NOTIFY_EMAIL,
          idempotencyKey: `partner-${inserted.id}`,
          templateData: {
            responsibleName: payload.responsible_name,
            phone: payload.phone,
            email: payload.email,
            cnpj: payload.cnpj,
            companyName: payload.company_name,
            businessType: payload.business_type,
            city: payload.city,
            state: payload.state,
            volumeNotes: payload.volume_notes || "-",
            submittedAt: new Date(inserted.created_at).toLocaleString("pt-BR"),
          },
        },
      });
    } catch {
      /* silent */
    }

    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <SuccessCard
        title="Recebemos seu cadastro"
        message="Nossa equipe comercial entrará em contato em breve."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
      <Field label="Nome do responsável" error={errors.responsible_name}>
        <input type="text" value={form.responsible_name} onChange={update("responsible_name")} className={inputCls(errors.responsible_name)} placeholder="Seu nome" autoComplete="name" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="WhatsApp" error={errors.phone}>
          <input type="tel" value={form.phone} onChange={update("phone")} className={inputCls(errors.phone)} placeholder="(11) 99999-0000" autoComplete="tel" />
        </Field>
        <Field label="Email corporativo" error={errors.email}>
          <input type="email" value={form.email} onChange={update("email")} className={inputCls(errors.email)} placeholder="contato@empresa.com" autoComplete="email" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="CNPJ" error={errors.cnpj}>
          <input type="text" value={form.cnpj} onChange={update("cnpj", maskCnpj)} className={inputCls(errors.cnpj)} placeholder="00.000.000/0000-00" inputMode="numeric" />
        </Field>
        <Field label="Razão social" error={errors.company_name}>
          <input type="text" value={form.company_name} onChange={update("company_name")} className={inputCls(errors.company_name)} placeholder="Empresa LTDA" />
        </Field>
      </div>

      <Field label="Tipo de negócio" error={errors.business_type}>
        <select value={form.business_type} onChange={update("business_type")} className={inputCls(errors.business_type)}>
          <option value="">Selecione</option>
          {BUSINESS_TYPES.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <Field label="Cidade" error={errors.city}>
            <input type="text" value={form.city} onChange={update("city")} className={inputCls(errors.city)} placeholder="Sua cidade" autoComplete="address-level2" />
          </Field>
        </div>
        <Field label="Estado" error={errors.state}>
          <select value={form.state} onChange={update("state")} className={inputCls(errors.state)}>
            <option value="">UF</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Volume estimado / interesse" error={errors.volume_notes}>
        <textarea
          value={form.volume_notes}
          onChange={update("volume_notes")}
          className={`${inputCls(errors.volume_notes)} min-h-[96px] resize-y`}
          placeholder="Ex.: revenda ~50 un/mês, indicação para pacientes, parceria clínica..."
          maxLength={600}
        />
      </Field>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full font-bold text-white text-sm md:text-base rounded-full py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#4667B4" }}
      >
        {submitting ? "Enviando..." : "Quero ser parceiro"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Ao enviar, você concorda em ser contatado pela nossa equipe comercial.
      </p>
    </form>
  );
};

export default PartnerForm;
