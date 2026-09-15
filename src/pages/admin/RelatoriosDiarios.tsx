import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

type LogRow = {
  id: string;
  message_id: string | null;
  recipient_email: string;
  status: string;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  sent: "bg-primary/10 text-primary",
  suppressed: "bg-secondary/20 text-foreground",
  failed: "bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<string, string> = {
  sent: "enviado",
  suppressed: "bloqueado",
  failed: "falhou",
};

const bahia = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Bahia" });

// O disparo automático roda todo dia às 12:00 UTC = 09:00 na Bahia.
const nextRun = () => {
  const now = new Date();
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0),
  );
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);
  return next.toLocaleString("pt-BR", {
    timeZone: "America/Bahia",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const triggerLabel = (metadata: Record<string, unknown> | null) =>
  metadata?.trigger === "cron" ? "automático" : metadata?.trigger === "manual" ? "manual" : "—";

const reportDateOf = (metadata: Record<string, unknown> | null) => {
  const value = metadata?.report_date;
  if (typeof value !== "string") return "—";
  const [y, m, d] = value.split("-");
  return y && m && d ? `${d}/${m}/${y}` : value;
};

const RECIPIENTS = [
  "ffmconsultoria@gmail.com",
  "pedrogmneto@hotmail.com",
  "Emersoncopywriter21@gmail.com",
];

type Preview = {
  subject: string;
  html: string;
  text: string;
  stats: {
    orders_count: number;
    items_count: number;
    gifts_count: number;
    gift_pending_count: number;
  };
};

const todayBahia = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bahia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts;
};

const RelatoriosDiarios = () => {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previewDate, setPreviewDate] = useState(todayBahia());
  const [conferenceTo, setConferenceTo] = useState(RECIPIENTS[0]);
  const [preview, setPreview] = useState<Preview | null>(null);


  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("email_send_log")
      .select("id,message_id,recipient_email,status,error_message,metadata,created_at")
      .eq("template_name", "daily-sales-report")
      .order("created_at", { ascending: false })
      .limit(200);
    setRows((data as LogRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    void load();
    void supabase.functions
      .invoke("daily-sales-report", { body: { mode: "schedule" } })
      .then(({ data, error }) => {
        if (error || !data?.schedule) {
          setSchedule({ found: false, active: false, unknown: true });
          return;
        }
        setSchedule({
          found: !!data.schedule.found,
          active: !!data.schedule.active,
          schedule: data.schedule.schedule ?? undefined,
        });
      });
  }, [isAdmin, load]);


  const sendNow = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const { data, error } = await supabase.functions.invoke("daily-sales-report", {
        body: {},
      });
      if (error) {
        setFeedback("Não foi possível enviar agora. Tente novamente em instantes.");
      } else {
        const skipped = (data?.results ?? []).filter((r: { skipped?: boolean }) => r.skipped).length;
        setFeedback(
          skipped > 0
            ? `Relatório de hoje já havia sido enviado para ${skipped} destinatário(s).`
            : "Relatório de hoje enviado.",
        );
      }
      await load();
    } finally {
      setBusy(false);
    }
  };

  const loadPreview = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const { data, error } = await supabase.functions.invoke("daily-sales-report", {
        body: { mode: "preview", report_date: previewDate || undefined },
      });
      if (error || !data?.html) {
        setPreview(null);
        setFeedback("Não foi possível gerar a prévia agora.");
        return;
      }
      setPreview({
        subject: String(data.subject ?? ""),
        html: String(data.html ?? ""),
        text: String(data.text ?? ""),
        stats: {
          orders_count: Number(data.content_stats?.orders_count ?? 0),
          items_count: Number(data.content_stats?.items_count ?? 0),
          gifts_count: Number(data.content_stats?.gifts_count ?? 0),
          gift_pending_count: Number(data.content_stats?.gift_pending_count ?? 0),
        },
      });
    } finally {
      setBusy(false);
    }
  };

  const sendConference = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const { data, error } = await supabase.functions.invoke("daily-sales-report", {
        body: { mode: "conference", recipient: conferenceTo, report_date: previewDate || undefined },
      });
      const result = data?.results?.[0];
      if (error || !result) {
        setFeedback("Não foi possível enviar a conferência agora.");
      } else if (result.status === "skipped") {
        setFeedback(`Conferência já enviada hoje para ${conferenceTo}.`);
      } else if (result.status === "sent") {
        setFeedback(`Conferência aceita pelo serviço de e-mail para ${conferenceTo}.`);
      } else if (result.status === "suppressed") {
        setFeedback(`${conferenceTo} está na lista de bloqueio do serviço de e-mail.`);
      } else {
        setFeedback(`Falha ao enviar para ${conferenceTo}.`);
      }
      await load();
    } finally {
      setBusy(false);
    }
  };


  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError("Email ou senha inválidos.");
  };

  if (session === null) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  }

  if (!session) {
    return (
      <main className="min-h-screen grid place-items-center bg-muted/40 px-4">
        <Helmet>
          <title>Relatórios diários | LipoVitta</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <form
          onSubmit={signIn}
          className="w-full max-w-sm bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <h1 className="font-display text-2xl text-primary">Relatórios diários</h1>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
          />
          {authError && <p className="text-sm text-destructive">{authError}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold">
            Entrar
          </button>
        </form>
      </main>
    );
  }

  if (isAdmin === false) {
    return (
      <main className="min-h-screen grid place-items-center px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground mb-2">Acesso restrito</p>
          <p className="text-muted-foreground mb-4">Esta conta não tem permissão de administrador.</p>
          <button onClick={() => supabase.auth.signOut()} className="underline text-primary">
            Sair
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 py-10 px-4">
      <Helmet>
        <title>Relatórios diários | LipoVitta</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-primary">Relatórios diários</h1>
            <p className="text-sm text-muted-foreground">
              Envio automático todo dia às 09h (horário da Bahia) para os endereços autorizados.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => void sendNow()}
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60"
            >
              {busy ? "Enviando…" : "Enviar relatório de hoje"}
            </button>
            <button onClick={() => void load()} className="text-sm underline text-primary">
              {loading ? "Atualizando…" : "Atualizar"}
            </button>
            <a href="/admin/conversoes" className="text-sm underline text-muted-foreground">
              Conversões
            </a>
            <a href="/admin/webhooks" className="text-sm underline text-muted-foreground">
              Webhooks
            </a>
            <button onClick={() => supabase.auth.signOut()} className="text-sm underline text-muted-foreground">
              Sair
            </button>
          </div>
        </header>

        <div className="mb-4 rounded-2xl border border-border bg-background p-4">
          <p className="text-sm font-semibold text-foreground">
            Envio automático ativo — todo dia às 09:00 (horário da Bahia)
          </p>
          <p className="text-sm text-muted-foreground">Próximo envio: {nextRun()} (Bahia)</p>
        </div>

        <section className="mb-4 rounded-2xl border border-border bg-background p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Prévia e conferência</p>
            <p className="text-xs text-muted-foreground">
              A prévia não envia nada. A conferência envia um e-mail por vez, apenas para os endereços
              autorizados, com o aviso “CONFERÊNCIA - NÃO GERAR NOVA EXPEDIÇÃO”.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs text-muted-foreground">
              Dia do relatório
              <input
                type="date"
                value={previewDate}
                onChange={(e) => setPreviewDate(e.target.value)}
                className="ml-2 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
              />
            </label>
            <button
              onClick={() => void loadPreview()}
              disabled={busy}
              className="px-4 py-2 rounded-xl border border-border text-sm font-semibold disabled:opacity-60"
            >
              {busy ? "Carregando…" : "Ver prévia"}
            </button>
            <select
              value={conferenceTo}
              onChange={(e) => setConferenceTo(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
            >
              {RECIPIENTS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button
              onClick={() => void sendConference()}
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-bold disabled:opacity-60"
            >
              Enviar conferência
            </button>
          </div>
          {preview && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Assunto: <span className="text-foreground">{preview.subject}</span> · {preview.stats.orders_count}{" "}
                pedido(s), {preview.stats.items_count} item(ns), {preview.stats.gifts_count} brinde(s),{" "}
                {preview.stats.gift_pending_count} pendência(s) de brinde
              </p>
              <iframe
                title="Prévia do relatório"
                srcDoc={preview.html}
                className="w-full h-[520px] rounded-xl border border-border bg-background"
              />
              <details>
                <summary className="text-xs text-muted-foreground cursor-pointer">Ver versão em texto</summary>
                <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-muted/60 p-3 text-xs text-foreground">
                  {preview.text}
                </pre>
              </details>
            </div>
          )}
        </section>

        {feedback && (
          <p className="mb-4 rounded-2xl border border-border bg-background p-4 text-sm text-foreground">{feedback}</p>
        )}


        <section className="bg-background border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Quando (Bahia)</th>
                  <th className="px-4 py-2">Destinatário</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Origem</th>
                  <th className="px-4 py-2">Dia do relatório</th>
                  <th className="px-4 py-2">Referência</th>
                  <th className="px-4 py-2">Observação</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">{bahia(r.created_at)}</td>
                    <td className="px-4 py-2 text-foreground">{r.recipient_email}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          STATUS_STYLES[r.status] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{triggerLabel(r.metadata)}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground whitespace-nowrap">
                      {reportDateOf(r.metadata)}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground break-all">{r.message_id ?? "—"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{r.error_message ?? "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                      Nenhum envio registrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RelatoriosDiarios;
