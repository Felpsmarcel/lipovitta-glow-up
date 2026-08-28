import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

type Delivery = {
  id: string;
  request_id: string;
  event: string | null;
  outcome: string;
  reason: string | null;
  ref: string | null;
  is_test: boolean;
  signature_present: boolean;
  signature_format: string | null;
  content_length: number | null;
  created_at: string;
};

type Order = {
  id: string;
  order_id: string;
  order_number: string | null;
  status: string | null;
  event: string | null;
  value_total: number | null;
  price_mismatch: boolean;
  price_diff: number | null;
  is_test: boolean;
  last_seen_at: string;
};

type GhlEvent = {
  id: string;
  event_type: string;
  status: string;
  attempts: number;
  last_error: string | null;
  is_test: boolean;
  created_at: string;
  sent_at: string | null;
};

const PERIODS = [
  { label: "1h", hours: 1 },
  { label: "24h", hours: 24 },
  { label: "7 dias", hours: 24 * 7 },
  { label: "30 dias", hours: 24 * 30 },
];

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const OUTCOME_STYLES: Record<string, string> = {
  processed: "bg-primary/10 text-primary",
  ok: "bg-primary/10 text-primary",
  ignored: "bg-muted text-muted-foreground",
  invalid_signature: "bg-destructive/10 text-destructive",
  parse_error: "bg-destructive/10 text-destructive",
  error: "bg-destructive/10 text-destructive",
};

const outcomeClass = (outcome: string) =>
  OUTCOME_STYLES[outcome] ?? "bg-secondary/20 text-foreground";

const GHL_STATUS_STYLES: Record<string, string> = {
  sent: "bg-primary/10 text-primary",
  pending: "bg-secondary/20 text-foreground",
  error: "bg-destructive/10 text-destructive",
  failed: "bg-destructive/10 text-destructive",
};

const ghlStatusClass = (status: string) =>
  GHL_STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";

const isFailure = (outcome: string) =>
  outcome.includes("error") || outcome.includes("invalid") || outcome.includes("fail");


const Webhooks = () => {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ghlEvents, setGhlEvents] = useState<GhlEvent[]>([]);
  const [ghlBusy, setGhlBusy] = useState(false);
  const [ghlConfigured, setGhlConfigured] = useState<boolean | null>(null);
  const [hours, setHours] = useState(24);
  const [includeTests, setIncludeTests] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    let dq = supabase
      .from("yampi_webhook_deliveries")
      .select(
        "id,request_id,event,outcome,reason,ref,is_test,signature_present,signature_format,content_length,created_at"
      )
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(200);
    if (!includeTests) dq = dq.eq("is_test", false);

    let oq = supabase
      .from("yampi_orders")
      .select(
        "id,order_id,order_number,status,event,value_total,price_mismatch,price_diff,is_test,last_seen_at"
      )
      .gte("last_seen_at", since)
      .order("last_seen_at", { ascending: false })
      .limit(100);
    if (!includeTests) oq = oq.eq("is_test", false);

    let gq = supabase
      .from("ghl_outbox")
      .select("id,event_type,status,attempts,last_error,is_test,created_at,sent_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(100);
    if (!includeTests) gq = gq.eq("is_test", false);

    const [d, o, g] = await Promise.all([dq, oq, gq]);
    setDeliveries((d.data as Delivery[]) ?? []);
    setOrders((o.data as Order[]) ?? []);
    setGhlEvents((g.data as GhlEvent[]) ?? []);
    setGhlConfigured(g.error ? null : g.data !== null);
    setLastUpdate(new Date());
    setLoading(false);
  }, [hours, includeTests]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  useEffect(() => {
    if (!isAdmin || !autoRefresh) return;
    const id = window.setInterval(() => void load(), 15000);
    return () => window.clearInterval(id);
  }, [isAdmin, autoRefresh, load]);

  // Near real-time: push new deliveries as they arrive
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("yampi-webhook-deliveries")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "yampi_webhook_deliveries" },
        (payload) => {
          const row = payload.new as Delivery;
          if (!includeTests && row.is_test) return;
          setDeliveries((prev) => [row, ...prev].slice(0, 200));
          setLastUpdate(new Date());
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isAdmin, includeTests]);

  const stats = useMemo(() => {
    const total = deliveries.length;
    const invalid = deliveries.filter((d) => d.outcome === "invalid_signature").length;
    const errors = deliveries.filter((d) => isFailure(d.outcome) && d.outcome !== "invalid_signature").length;
    const ignored = deliveries.filter((d) => d.outcome === "ignored").length;
    const ok = total - invalid - errors - ignored;
    const byOutcome = new Map<string, number>();
    deliveries.forEach((d) => byOutcome.set(d.outcome, (byOutcome.get(d.outcome) ?? 0) + 1));
    const byEvent = new Map<string, number>();
    deliveries.forEach((d) => {
      const k = d.event ?? "—";
      byEvent.set(k, (byEvent.get(k) ?? 0) + 1);
    });
    return {
      total,
      ok,
      invalid,
      errors,
      ignored,
      mismatches: orders.filter((o) => o.price_mismatch).length,
      byOutcome: [...byOutcome.entries()].sort((a, b) => b[1] - a[1]),
      byEvent: [...byEvent.entries()].sort((a, b) => b[1] - a[1]),
      lastReceived: deliveries[0]?.created_at ?? null,
    };
  }, [deliveries, orders]);

  const ghlStats = useMemo(() => {
    const count = (status: string) => ghlEvents.filter((event) => event.status === status).length;
    return { pending: count("pending"), sent: count("sent"), error: count("error"), failed: count("failed") };
  }, [ghlEvents]);

  const retryGhl = async () => {
    setGhlBusy(true);
    try {
      const { data } = await supabase.functions.invoke("ghl-dispatch", { body: { action: "retry" } });
      if (data?.ok) await load();
    } finally {
      setGhlBusy(false);
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
          <title>Webhooks Yampi | LipoVitta</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <form onSubmit={signIn} className="w-full max-w-sm bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h1 className="font-display text-2xl text-primary">Webhooks Yampi</h1>
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
        <title>Webhooks Yampi | LipoVitta</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-primary">Webhooks Yampi</h1>
            <p className="text-sm text-muted-foreground">
              {lastUpdate ? `Atualizado às ${lastUpdate.toLocaleTimeString("pt-BR")}` : "Carregando…"}
              {stats.lastReceived
                ? ` · última requisição ${new Date(stats.lastReceived).toLocaleString("pt-BR")}`
                : " · nenhuma requisição no período"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.hours}
                onClick={() => setHours(p.hours)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  hours === p.hours
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {p.label}
              </button>
            ))}
            <label className="flex items-center gap-1.5 text-sm text-muted-foreground ml-2">
              <input type="checkbox" checked={includeTests} onChange={(e) => setIncludeTests(e.target.checked)} />
              Testes
            </label>
            <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
              Auto
            </label>
            <button onClick={() => void load()} className="text-sm underline text-primary">
              {loading ? "Atualizando…" : "Atualizar"}
            </button>
            <a href="/admin/conversoes" className="text-sm underline text-muted-foreground">
              Conversões
            </a>
            <button onClick={() => supabase.auth.signOut()} className="text-sm underline text-muted-foreground">
              Sair
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Requisições", value: String(stats.total) },
            { label: "Processadas", value: String(stats.ok) },
            { label: "Ignoradas", value: String(stats.ignored) },
            { label: "Assinatura inválida", value: String(stats.invalid), alert: stats.invalid > 0 },
            { label: "Erros de parser", value: String(stats.errors), alert: stats.errors > 0 },
          ].map((c) => (
            <div key={c.label} className="bg-background border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{c.label}</p>
              <p className={`text-2xl font-extrabold ${c.alert ? "text-destructive" : "text-primary"}`}>{c.value}</p>
            </div>
          ))}
        </section>

        {stats.total === 0 && (
          <div className="mb-8 rounded-2xl border border-border bg-background p-5 text-sm text-muted-foreground">
            Nenhuma requisição recebida no período. Confirme no painel da Yampi que o webhook aponta para a função
            <strong className="text-foreground"> yampi-webhook</strong> e que os eventos <code>order.created</code>,{" "}
            <code>order.paid</code>, <code>order.status.updated</code> e <code>cart.reminder</code> estão marcados.
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-background border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-lg text-foreground mb-3">Por resultado</h2>
            <ul className="space-y-2">
              {stats.byOutcome.length === 0 && <li className="text-sm text-muted-foreground">Sem dados no período.</li>}
              {stats.byOutcome.map(([k, v]) => (
                <li key={k} className="flex justify-between text-sm border-b border-border/60 pb-1.5">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${outcomeClass(k)}`}>{k}</span>
                  <span className="font-bold text-primary">{v}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-background border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-lg text-foreground mb-3">Por evento</h2>
            <ul className="space-y-2">
              {stats.byEvent.length === 0 && <li className="text-sm text-muted-foreground">Sem dados no período.</li>}
              {stats.byEvent.map(([k, v]) => (
                <li key={k} className="flex justify-between text-sm border-b border-border/60 pb-1.5">
                  <span className="text-foreground">{k}</span>
                  <span className="font-bold text-primary">{v}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-background border border-border rounded-2xl overflow-hidden mb-8">
          <div className="p-5 pb-3">
            <h2 className="font-semibold text-lg text-foreground">Requisições recebidas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Quando</th>
                  <th className="px-4 py-2">Evento</th>
                  <th className="px-4 py-2">Resultado</th>
                  <th className="px-4 py-2">Motivo</th>
                  <th className="px-4 py-2">Assinatura</th>
                  <th className="px-4 py-2">Ref</th>
                  <th className="px-4 py-2">Bytes</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.id} className="border-t border-border/60">
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(d.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      {d.event ?? "—"}
                      {d.is_test && (
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">teste</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${outcomeClass(d.outcome)}`}>
                        {d.outcome}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{d.reason ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {d.signature_present ? d.signature_format ?? "presente" : "ausente"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{d.ref ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{d.content_length ?? "—"}</td>
                  </tr>
                ))}
                {deliveries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                      Nenhuma requisição registrada no período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-background border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-semibold text-lg text-foreground">Pedidos registrados</h2>
            {stats.mismatches > 0 && (
              <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                {stats.mismatches} com divergência de preço
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Atualizado</th>
                  <th className="px-4 py-2">Pedido</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Evento</th>
                  <th className="px-4 py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border/60">
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(o.last_seen_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      #{o.order_number ?? o.order_id}
                      {o.is_test && (
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">teste</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{o.status ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{o.event ?? "—"}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <span>{o.value_total != null ? brl(Number(o.value_total)) : "—"}</span>
                        {o.price_mismatch && o.price_diff != null && (
                          <span className="inline-flex w-fit items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                            ⚠ Divergência {brl(Number(o.price_diff))}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Nenhum pedido registrado no período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-background border border-border rounded-2xl overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
            <div>
              <h2 className="font-semibold text-lg text-foreground">Sincronização com o GHL</h2>
              <p className="text-sm text-muted-foreground">
                {ghlConfigured === false
                  ? "Envio em simulação — a URL do webhook do GHL ainda não foi cadastrada."
                  : "Eventos enfileirados para o GoHighLevel no período."}
              </p>
            </div>
            <button
              onClick={() => void retryGhl()}
              disabled={ghlBusy || ghlStats.failed + ghlStats.error === 0}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-primary disabled:opacity-50"
            >
              {ghlBusy ? "Reprocessando…" : "Reprocessar falhas"}
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-5 pb-5">
            {[
              { label: "Pendentes", value: ghlStats.pending },
              { label: "Enviados", value: ghlStats.sent },
              { label: "Com erro", value: ghlStats.error, alert: ghlStats.error > 0 },
              { label: "Falha definitiva", value: ghlStats.failed, alert: ghlStats.failed > 0 },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{c.label}</p>
                <p className={`text-2xl font-extrabold ${c.alert ? "text-destructive" : "text-primary"}`}>{c.value}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Quando</th>
                  <th className="px-4 py-2">Evento</th>
                  <th className="px-4 py-2">Situação</th>
                  <th className="px-4 py-2">Tentativas</th>
                  <th className="px-4 py-2">Último erro</th>
                </tr>
              </thead>
              <tbody>
                {ghlEvents.map((g) => (
                  <tr key={g.id} className="border-t border-border/60">
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(g.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      {g.event_type}
                      {g.is_test && (
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">teste</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${ghlStatusClass(g.status)}`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{g.attempts}</td>
                    <td className="px-4 py-2 text-muted-foreground">{g.last_error ?? "—"}</td>
                  </tr>
                ))}
                {ghlEvents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Nenhum evento enfileirado no período.
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

export default Webhooks;
