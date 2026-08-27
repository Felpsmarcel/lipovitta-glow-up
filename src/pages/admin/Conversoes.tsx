import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

type ConversionEvent = {
  id: string;
  event_name: string;
  source: string;
  cta_location: string | null;
  product_name: string | null;
  value: number | null;
  order_id: string | null;
  gift: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  meta_status: string | null;
  metadata: {
    expected_value?: number | null;
    price_diff?: number | null;
    price_mismatch?: boolean;
  } | null;
  created_at: string;
};

const priceAlert = (e: ConversionEvent) => {
  const m = e.metadata;
  if (!m?.price_mismatch || m.price_diff == null) return null;
  return {
    diff: Number(m.price_diff),
    expected: m.expected_value != null ? Number(m.expected_value) : null,
  };
};


const GIFT_LABELS: Record<string, string> = {
  brinde_raspador: "Raspador de língua",
  brinde_portacapsulas: "Porta cápsulas",
  brinde_mixer: "Mixer Dosador",
  brinde_garrafa: "Garrafa Térmica",
};

const giftLabel = (utm?: string | null) => {
  if (!utm) return "—";
  return GIFT_LABELS[utm] ?? utm;
};

const PERIODS = [
  { label: "Hoje", days: 1 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
];

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Conversoes = () => {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [events, setEvents] = useState<ConversionEvent[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(!!s);
    });
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
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("conversion_events")
      .select(
        "id,event_name,source,cta_location,product_name,value,order_id,gift,utm_source,utm_campaign,meta_status,metadata,created_at"
      )
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1000);
    setEvents((data as ConversionEvent[]) ?? []);
    setLoading(false);
  }, [days]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const stats = useMemo(() => {
    const clicks = events.filter((e) => e.event_name === "CTAClick" || e.event_name === "AddToCart");
    const checkouts = events.filter((e) => e.event_name === "InitiateCheckout");
    const leads = events.filter((e) => e.event_name === "Lead");
    const purchases = events.filter((e) => e.event_name === "Purchase");
    const revenue = purchases.reduce((acc, p) => acc + Number(p.value ?? 0), 0);

    const byCta = new Map<string, number>();
    clicks.concat(checkouts).forEach((e) => {
      const k = e.cta_location ?? "—";
      byCta.set(k, (byCta.get(k) ?? 0) + 1);
    });

    const bySource = new Map<string, { clicks: number; purchases: number; revenue: number }>();
    events.forEach((e) => {
      const k = e.utm_source ?? "direto";
      const cur = bySource.get(k) ?? { clicks: 0, purchases: 0, revenue: 0 };
      if (e.event_name === "Purchase") {
        cur.purchases += 1;
        cur.revenue += Number(e.value ?? 0);
      } else {
        cur.clicks += 1;
      }
      bySource.set(k, cur);
    });

    return {
      clicks: clicks.length,
      checkouts: checkouts.length,
      leads: leads.length,
      purchases: purchases.length,
      revenue,
      conversion: checkouts.length ? (purchases.length / checkouts.length) * 100 : 0,
      byCta: [...byCta.entries()].sort((a, b) => b[1] - a[1]),
      bySource: [...bySource.entries()].sort((a, b) => b[1].revenue - a[1].revenue),
    };
  }, [events]);

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
          <title>Painel de conversões | LipoVitta</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <form onSubmit={signIn} className="w-full max-w-sm bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h1 className="font-display text-2xl text-primary">Painel de conversões</h1>
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
        <title>Painel de conversões | LipoVitta</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-display text-3xl text-primary">Conversões</h1>
          <div className="flex items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                onClick={() => setDays(p.days)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  days === p.days
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {p.label}
              </button>
            ))}
            <a href="/admin/webhooks" className="text-sm underline text-muted-foreground ml-2">
              Webhooks
            </a>
            <button onClick={() => supabase.auth.signOut()} className="text-sm underline text-muted-foreground ml-2">
              Sair
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Cliques em CTA", value: String(stats.clicks) },
            { label: "Checkouts iniciados", value: String(stats.checkouts) },
            { label: "Cadastros", value: String(stats.leads) },
            { label: "Compras", value: String(stats.purchases) },
            { label: "Faturamento", value: brl(stats.revenue) },
          ].map((c) => (
            <div key={c.label} className="bg-background border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{c.label}</p>
              <p className="text-2xl font-extrabold text-primary">{c.value}</p>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-background border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-lg text-foreground mb-3">Cliques por botão</h2>
            <ul className="space-y-2">
              {stats.byCta.length === 0 && <li className="text-sm text-muted-foreground">Sem dados no período.</li>}
              {stats.byCta.map(([k, v]) => (
                <li key={k} className="flex justify-between text-sm border-b border-border/60 pb-1.5">
                  <span className="text-foreground">{k}</span>
                  <span className="font-bold text-primary">{v}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-background border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-lg text-foreground mb-3">Por origem (UTM)</h2>
            <ul className="space-y-2">
              {stats.bySource.length === 0 && <li className="text-sm text-muted-foreground">Sem dados no período.</li>}
              {stats.bySource.map(([k, v]) => (
                <li key={k} className="flex justify-between text-sm border-b border-border/60 pb-1.5">
                  <span className="text-foreground">{k}</span>
                  <span className="text-muted-foreground">
                    {v.clicks} cliques · {v.purchases} compras · {brl(v.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-background border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-semibold text-lg text-foreground">Últimos eventos</h2>
            <button onClick={() => void load()} className="text-sm underline text-primary">
              {loading ? "Atualizando…" : "Atualizar"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Quando</th>
                  <th className="px-4 py-2">Evento</th>
                  <th className="px-4 py-2">Origem</th>
                  <th className="px-4 py-2">Botão / Produto</th>
                  <th className="px-4 py-2">Valor</th>
                  <th className="px-4 py-2">Pedido</th>
                  <th className="px-4 py-2">Brinde</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 100).map((e) => (
                  <tr key={e.id} className="border-t border-border/60">
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(e.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 font-semibold text-foreground">{e.event_name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{e.utm_source ?? e.source}</td>
                    <td className="px-4 py-2 text-foreground">{e.cta_location ?? e.product_name ?? "—"}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <span>{e.value != null ? brl(Number(e.value)) : "—"}</span>
                        {priceAlert(e) && (
                          <span
                            className="inline-flex w-fit items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive"
                            title={`Esperado ${
                              priceAlert(e)!.expected != null ? brl(priceAlert(e)!.expected!) : "—"
                            } · diferença ${brl(priceAlert(e)!.diff)}`}
                          >
                            ⚠ Divergência {brl(priceAlert(e)!.diff)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{e.order_id ?? "—"}</td>
                    <td className="px-4 py-2 text-foreground">{giftLabel(e.gift)}</td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                      Nenhum evento registrado no período.
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

export default Conversoes;
