import { describe, it, expect, vi, beforeEach } from "vitest";

const supabaseMock = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("../supabase", () => ({
  supabaseForUser: () => {
    if (!supabaseMock.current) throw new Error("fetch failed");
    return supabaseMock.current;
  },
}));

import ghlConfigStatusTool from "./ghl-config-status";
import listYampiOrdersTool from "./list-yampi-orders";
import trackingHealthTool from "./tracking-health";

type AnyTool = { handler: (input: any, ctx: any) => Promise<any> };

const ctx = (opts: { auth?: boolean } = {}) => ({
  isAuthenticated: () => opts.auth !== false,
  getUserId: () => (opts.auth === false ? null : "user-1"),
  getToken: () => "token",
});

/** Constrói um mock encadeável do query builder do supabase-js. */
function makeSupabase(opts: {
  roleRow?: { role: string } | null;
  roleError?: { message: string } | null;
  rows?: any[];
  rowsError?: { message: string } | null;
  count?: number;
  rpc?: any;
  rpcError?: { message: string } | null;
}) {
  const ordersResult = {
    data: opts.rows ?? [],
    error: opts.rowsError ?? null,
    count: opts.count ?? (opts.rows?.length ?? 0),
  };
  return {
    from(table: string) {
      if (table === "user_roles") {
        const chain: any = {
          select: () => chain,
          eq: () => chain,
          maybeSingle: async () => ({
            data: opts.roleRow === undefined ? { role: "admin" } : opts.roleRow,
            error: opts.roleError ?? null,
          }),
        };
        return chain;
      }
      const chain: any = {
        select: () => chain,
        gte: () => chain,
        eq: () => chain,
        order: () => chain,
        range: () => Promise.resolve(ordersResult),
        then: (res: any) => Promise.resolve(ordersResult).then(res),
      };
      return chain;
    },
    rpc: async () => ({ data: opts.rpc ?? {}, error: opts.rpcError ?? null }),
  };
}

const parse = (result: any) => JSON.parse(result.content[0].text);

beforeEach(() => {
  supabaseMock.current = makeSupabase({});
});

describe("ghl_config_status", () => {
  it("retorna apenas estado sanitizado para admin", async () => {
    const out = await (ghlConfigStatusTool as unknown as AnyTool).handler({}, ctx());
    const body = parse(out);
    expect(body.ok).toBe(true);
    expect(typeof body.token_configured).toBe("boolean");
    expect(typeof body.location_matches_expected).toBe("boolean");
    expect(JSON.stringify(body)).not.toMatch(/eyJ|pit-/);
  });

  it("nega usuário não autenticado com erro estruturado", async () => {
    const out = await (ghlConfigStatusTool as unknown as AnyTool).handler({}, ctx({ auth: false }));
    const body = parse(out);
    expect(body.code).toBe("not_authenticated");
    expect(body.tool).toBe("ghl_config_status");
    expect(out.isError).toBe(true);
  });

  it("nega usuário sem papel admin", async () => {
    supabaseMock.current = makeSupabase({ roleRow: null });
    const out = await (ghlConfigStatusTool as unknown as AnyTool).handler({}, ctx());
    expect(parse(out).code).toBe("forbidden");
  });

  it("converte queda do banco em erro estruturado, não exceção", async () => {
    supabaseMock.current = null;
    const out = await (ghlConfigStatusTool as unknown as AnyTool).handler({}, ctx());
    const body = parse(out);
    expect(body.code).toBe("backend_unavailable");
    expect(body.stage).toBe("authorization");
  });
});

describe("list_yampi_orders", () => {
  const paid = {
    order_id: "1",
    order_number: "81",
    status: "paid",
    items: [{ sku: "A" }],
    value_total: "386.73",
    is_test: false,
  };
  const waiting = { order_id: "2", status: "waiting_payment", is_test: false };
  const nulls = { order_id: "3", status: null, items: null, value_total: null, is_test: null };

  it("lista pedidos e marca pagamento corretamente", async () => {
    supabaseMock.current = makeSupabase({ rows: [paid, waiting] });
    const out = await (listYampiOrdersTool as unknown as AnyTool).handler(
      { days: 30, limit: 100, include_tests: false },
      ctx()
    );
    const body = parse(out);
    expect(body.ok).toBe(true);
    expect(body.orders[0].is_paid).toBe(true);
    expect(body.orders[1].is_paid).toBe(false);
    expect(body.orders[0].value_total).toBe(386.73);
  });

  it("tolera campos nulos", async () => {
    supabaseMock.current = makeSupabase({ rows: [nulls] });
    const body = parse(
      await (listYampiOrdersTool as unknown as AnyTool).handler({ days: 30 }, ctx())
    );
    expect(body.orders[0].items).toEqual([]);
    expect(body.orders[0].value_total).toBeNull();
    expect(body.orders[0].is_test).toBe(false);
  });

  it("retorna aviso quando não há dados", async () => {
    supabaseMock.current = makeSupabase({ rows: [] });
    const body = parse(
      await (listYampiOrdersTool as unknown as AnyTool).handler({ days: 30 }, ctx())
    );
    expect(body.orders).toEqual([]);
    expect(body.warnings.length).toBeGreaterThan(0);
  });

  it("devolve erro estruturado quando a consulta falha", async () => {
    supabaseMock.current = makeSupabase({ rowsError: { message: "permission denied for table" } });
    const body = parse(
      await (listYampiOrdersTool as unknown as AnyTool).handler({ days: 30 }, ctx())
    );
    expect(body.code).toBe("forbidden");
    expect(body.stage).toBe("query");
  });
});

describe("tracking_health", () => {
  it("agrega e gera gaps", async () => {
    supabaseMock.current = makeSupabase({
      rpc: {
        initiate_checkouts: 10,
        yampi_orders_total: 3,
        yampi_orders_paid: 2,
        yampi_orders_waiting_payment: 1,
        purchases_from_yampi: 1,
        internal_purchases: 2,
        meta_sent: 1,
      },
    });
    const body = parse(
      await (trackingHealthTool as unknown as AnyTool).handler({ days: 30 }, ctx())
    );
    expect(body.ok).toBe(true);
    expect(body.gaps.some((g: string) => g.includes("aguardando pagamento"))).toBe(true);
  });

  it("retorna warnings quando não há dados", async () => {
    supabaseMock.current = makeSupabase({ rpc: {} });
    const body = parse(
      await (trackingHealthTool as unknown as AnyTool).handler({ days: 30 }, ctx())
    );
    expect(body.warnings.length).toBeGreaterThan(0);
    expect(body.gaps).toEqual([]);
  });

  it("erro de RPC vira erro estruturado", async () => {
    supabaseMock.current = makeSupabase({
      rpcError: { message: "permission denied for function has_role" },
    });
    const body = parse(
      await (trackingHealthTool as unknown as AnyTool).handler({ days: 30 }, ctx())
    );
    expect(body.code).toBe("authorization_unavailable");
    expect(body.stage).toBe("rpc:mcp_tracking_health");
  });
});
