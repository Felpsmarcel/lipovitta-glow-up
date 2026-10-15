import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { parseCsv, toCompactCsv } from "@/lib/campaignCsv";

type Insight = {
  summary: string;
  trends: { title: string; detail: string }[];
  optimizations: { priority: string; action: string; reason: string; expected_impact: string }[];
  alerts: { title: string; detail: string }[];
  data_gaps: string[];
};
type Sales = { orders: number; revenue: number; avg_ticket: number };
type Analysis = {
  id: string;
  campaign_name: string | null;
  period_from: string | null;
  period_to: string | null;
  status: string;
  error: string | null;
  result: Insight | null;
  sales_snapshot: Sales | null;
  created_at: string;
};

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const today = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - 3 * 3600_000 - n * 86400_000).toISOString().slice(0, 10);
const input = "w-full px-3 py-2 rounded-xl border border-border bg-background text-sm";

const Campanhas = () => {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [from, setFrom] = useState(daysAgo(7));
  const [to, setTo] = useState(today());
  const [text, setText] = useState("");
  const [csvRows, setCsvRows] = useState<string[][] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [current, setCurrent] = useState<Analysis | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase.from("user_roles").select("role").eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from("campaign_analyses")
      .select("id,campaign_name,period_from,period_to,status,error,result,sales_snapshot,created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    setHistory((data as unknown as Analysis[]) ?? []);
  }, []);

  useEffect(() => {
    if (isAdmin) void loadHistory();
  }, [isAdmin, loadHistory]);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const rows = parseCsv(await f.text());
    setCsvRows(rows);
    setFileName(f.name);
  };

  const analyze = async () => {
    setError(null);
    const raw = csvRows ? toCompactCsv(csvRows) : text.trim();
    if (raw.length < 10) return setError("Envie uma planilha ou cole os dados da campanha.");
    if (raw.length > 200_000) return setError("Dados muito grandes. Envie um período menor.");
    setRunning(true);
    setCurrent(null);
    const { data, error: err } = await supabase.functions.invoke("campaign-insights", {
      body: { campaign_name: name || null, period_from: from, period_to: to, source_type: csvRows ? "csv" : "text", raw_input: raw },
    });
    setRunning(false);
    if (err) {
      let msg = "Não foi possível analisar agora.";
      try {
        const b = await (err as { context?: Response }).context?.json();
        if (b?.error) msg = b.error;
      } catch { /* ignore */ }
      setError(msg);
    } else if (data?.result) {
      setCurrent({ id: data.id, campaign_name: name || null, period_from: from, period_to: to, status: "done", error: null, result: data.result, sales_snapshot: data.sales, created_at: new Date().toISOString() });
    }
    void loadHistory();
  };

  if (session === null) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;

  if (!session)
    return (
      <main className="min-h-screen grid place-items-center bg-muted/40 px-4">
        <Helmet><title>Análise de campanhas | LipoVitta</title><meta name="robots" content="noindex,nofollow" /></Helmet>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            setAuthError(error ? "Email ou senha inválidos." : null);
          }}
          className="w-full max-w-sm bg-background border border-border rounded-2xl p-6 space-y-4"
        >
          <h1 className="font-display text-2xl text-primary">Análise de campanhas</h1>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={input} />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className={input} />
          {authError && <p className="text-sm text-destructive">{authError}</p>}
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold">Entrar</button>
        </form>
      </main>
    );

  if (isAdmin === false)
    return (
      <main className="min-h-screen grid place-items-center text-center px-4">
        <div>
          <p className="font-semibold mb-2">Acesso restrito</p>
          <button onClick={() => supabase.auth.signOut()} className="underline text-primary">Sair</button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <Helmet><title>Análise de campanhas | LipoVitta</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-3xl text-primary">Análise de campanhas com IA</h1>
            <p className="text-sm text-muted-foreground">Envie os dados do Meta/Google Ads. A análise cruza com as vendas pagas reais do período.</p>
          </div>
          <a href="/admin/conversoes" className="text-sm underline text-primary">Painel de conversões</a>
        </header>

        <section className="bg-background border border-border rounded-2xl p-5 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="text-sm">Campanha<input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} placeholder="Ex.: Pré Black VIP" className={input} /></label>
            <label className="text-sm">De<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} /></label>
            <label className="text-sm">Até<input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={input} /></label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">Planilha CSV</label>
            <input type="file" accept=".csv,text/csv" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" />
            {csvRows && (
              <div className="text-xs">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-muted-foreground">{fileName} — {Math.max(csvRows.length - 1, 0)} linhas</span>
                  <button className="underline text-primary" onClick={() => { setCsvRows(null); setFileName(null); }}>Remover</button>
                </div>
                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="text-left">
                    <tbody>
                      {csvRows.slice(0, 6).map((r, i) => (
                        <tr key={i} className={i === 0 ? "font-semibold bg-muted/50" : "border-t border-border"}>
                          {r.slice(0, 12).map((c, j) => <td key={j} className="px-2 py-1 whitespace-nowrap">{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          {!csvRows && (
            <label className="text-sm block">Ou cole os dados
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} placeholder="Ex.: Campanha X — gasto R$ 1.200, 340 cliques, 18 compras reportadas, CPM R$ 22…" className={input} />
            </label>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button onClick={analyze} disabled={running} className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-60">
            {running ? "Analisando… pode levar até 1 minuto" : "Analisar campanha"}
          </button>
        </section>

        {current?.result && <Result a={current} />}

        <section className="bg-background border border-border rounded-2xl p-5">
          <h2 className="font-semibold mb-3">Histórico</h2>
          {history.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma análise ainda.</p> : (
            <ul className="divide-y divide-border">
              {history.map((h) => (
                <li key={h.id} className="py-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span>
                    <strong>{h.campaign_name || "Sem nome"}</strong>{" "}
                    <span className="text-muted-foreground">{h.period_from} a {h.period_to} · {new Date(h.created_at).toLocaleString("pt-BR")}</span>
                  </span>
                  {h.status === "done" ? (
                    <button className="underline text-primary" onClick={() => { setCurrent(h); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Abrir</button>
                  ) : (
                    <span className="text-destructive text-xs">{h.status === "pending" ? "Em andamento/interrompida" : h.error || "Falhou"}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

const Result = ({ a }: { a: Analysis }) => {
  const r = a.result!;
  const s = a.sales_snapshot;
  return (
    <section className="bg-background border border-border rounded-2xl p-5 space-y-5">
      <div>
        <h2 className="font-display text-2xl text-primary">{a.campaign_name || "Análise"}</h2>
        <p className="text-xs text-muted-foreground">{a.period_from} a {a.period_to}</p>
      </div>
      {s && (
        <div className="grid grid-cols-3 gap-3 text-center">
          {[["Pedidos pagos", String(s.orders)], ["Receita real", brl(s.revenue)], ["Ticket médio", brl(s.avg_ticket)]].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="font-bold">{v}</p></div>
          ))}
        </div>
      )}
      <p className="text-sm leading-relaxed">{r.summary}</p>
      {r.alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-destructive">Alertas</h3>
          {r.alerts.map((x, i) => <p key={i} className="text-sm"><strong>{x.title}:</strong> {x.detail}</p>)}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="font-semibold">Tendências</h3>
        {r.trends.map((x, i) => <p key={i} className="text-sm"><strong>{x.title}:</strong> {x.detail}</p>)}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">Otimizações sugeridas</h3>
        {r.optimizations.map((o, i) => (
          <div key={i} className="border border-border rounded-xl p-3 text-sm">
            <span className="text-xs uppercase font-bold text-primary">Prioridade {o.priority}</span>
            <p className="font-semibold">{o.action}</p>
            <p className="text-muted-foreground">{o.reason}</p>
            <p className="text-xs mt-1">Impacto esperado: {o.expected_impact}</p>
          </div>
        ))}
      </div>
      {r.data_gaps.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm">Dados que faltaram</h3>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">{r.data_gaps.map((g, i) => <li key={i}>{g}</li>)}</ul>
        </div>
      )}
    </section>
  );
};

export default Campanhas;
