import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  GhlApiError,
  assertPaidOrder,
  buildOpportunityPayload,
  buildOrderTags,
  buildUpsertContactPayload,
  ghlConfigStatus,
  maskContact,
  normalizeTags,
  requireGhlConfig,
  runPaidOrderSync,
  sanitizeTag,
  upsertContact,
  type PaidOrderApi,
  type PaidOrderPlan,
} from "./ghlApi";

const ENV_KEYS = [
  "GHL_PRIVATE_INTEGRATION_TOKEN",
  "GHL_ACCESS_TOKEN",
  "GHL_LOCATION_ID",
  "GHL_WEBHOOK_URL",
] as const;

let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  for (const k of ENV_KEYS) delete process.env[k];
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  vi.restoreAllMocks();
});

describe("configuração (fail closed)", () => {
  it("falha com erro claro quando não há token", () => {
    expect(() => requireGhlConfig()).toThrow(GhlApiError);
    expect(() => requireGhlConfig()).toThrow(/GHL_PRIVATE_INTEGRATION_TOKEN/);
  });

  it("não faz nenhuma chamada de rede sem token", async () => {
    const fetchImpl = vi.fn();
    await expect(upsertContact({ email: "a@b.com" }, { fetchImpl })).rejects.toBeInstanceOf(GhlApiError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("aceita o access token como fallback e usa o location padrão da LipoVitta", () => {
    process.env.GHL_ACCESS_TOKEN = "tok-fake";
    const status = ghlConfigStatus();
    expect(status.token_configured).toBe(true);
    expect(status.token_source).toBe("GHL_ACCESS_TOKEN");
    expect(status.location_source).toBe("fallback_lipovitta");
    expect(status.direct_api_ready).toBe(true);
    expect(JSON.stringify(status)).not.toContain("tok-fake");
  });

  it("prefere a integração privada e nunca expõe o token", () => {
    process.env.GHL_PRIVATE_INTEGRATION_TOKEN = "pit-secreto";
    process.env.GHL_LOCATION_ID = "fJzQmnIkw2U71SbtBDld";
    const status = ghlConfigStatus();
    expect(status.token_source).toBe("GHL_PRIVATE_INTEGRATION_TOKEN");
    expect(status.location_source).toBe("GHL_LOCATION_ID");
    expect(status.location_id_suffix).toBe("BDld");
    expect(JSON.stringify(status)).not.toContain("pit-secreto");
  });
});

describe("tags", () => {
  it("sanitiza acentos, espaços e maiúsculas", () => {
    expect(sanitizeTag("Cápsulas LipoVitta ")).toBe("capsulas-lipovitta");
    expect(sanitizeTag("LIP-CAPS-001")).toBe("lip-caps-001");
    expect(sanitizeTag("   ")).toBe("");
  });

  it("remove duplicadas (idempotente)", () => {
    expect(normalizeTags(["Compra", "compra", " COMPRA "])).toEqual(["compra"]);
  });

  it("monta as tags de um pedido pago com o marcador de comprador", () => {
    const tags = buildOrderTags([
      { sku: "LIP-CAPS-001", name: "Cápsulas Lipovitta" },
      { sku: "LIP-CAPS-001", name: "Cápsulas Lipovitta" },
      { sku: null, name: "Shot Matinal TANGERINA" },
    ]);
    expect(tags).toEqual(["lipovitta-comprador", "lip-caps-001", "shot-matinal-tangerina"]);
  });
});

describe("payloads", () => {
  it("upsert de contato não envia tags (não sobrescreve as existentes)", () => {
    const payload = buildUpsertContactPayload(
      { first_name: "Maria", last_name: "Silva", email: " Maria@X.com ", phone: "+5511987654321", source: "yampi" },
      "loc-1",
    );
    expect(payload).toEqual({
      locationId: "loc-1",
      firstName: "Maria",
      lastName: "Silva",
      email: "maria@x.com",
      phone: "+5511987654321",
      source: "yampi",
    });
    expect(payload).not.toHaveProperty("tags");
  });

  it("mascara o contato para logs e simulação", () => {
    const masked = maskContact({ first_name: "Maria", last_name: "Silva", email: "maria@x.com", phone: "5511987654321" });
    expect(masked).toEqual({ first_name: "M***", last_name: "S***", email: "ma***@x.com", phone: "55*******4321" });
  });

  it("monta a oportunidade com os campos opcionais apenas quando existem", () => {
    const payload = buildOpportunityPayload(
      { contact_id: "c1", pipeline_id: "p1", name: "Pedido 1", status: "won", monetary_value: 386.73 },
      "loc-1",
    );
    expect(payload).toEqual({
      pipelineId: "p1",
      locationId: "loc-1",
      name: "Pedido 1",
      status: "won",
      contactId: "c1",
      monetaryValue: 386.73,
    });
  });
});

describe("assertPaidOrder", () => {
  it("aceita paid e approved", () => {
    expect(assertPaidOrder({ order_id: "1", status: "paid" }).status).toBe("paid");
    expect(assertPaidOrder({ order_id: "1", status: "APPROVED" }).status).toBe("approved");
  });

  it("bloqueia pedido não pago", () => {
    expect(() => assertPaidOrder({ order_id: "74", status: "cancelled" })).toThrow(/somente pedidos pagos/);
    expect(() => assertPaidOrder({ order_id: "74", status: "invoiced" })).toThrow(GhlApiError);
    expect(() => assertPaidOrder({ order_id: "74", status: "on_carriage" })).toThrow(GhlApiError);
    expect(() => assertPaidOrder(null)).toThrow(/não encontrado/);
  });
});

function fakeApi(): PaidOrderApi & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    upsertContact: async () => {
      calls.push("upsertContact");
      return { contact_id: "contact-1", new: true, raw: {} };
    },
    addContactTags: async () => {
      calls.push("addContactTags");
      return {};
    },
    enrollContactInWorkflow: async () => {
      calls.push("enrollContactInWorkflow");
      return {};
    },
    findOpportunity: async () => {
      calls.push("findOpportunity");
      return null;
    },
    createOpportunity: async () => {
      calls.push("createOpportunity");
      return { id: "opp-1" };
    },
    updateOpportunity: async () => {
      calls.push("updateOpportunity");
      return { id: "opp-1" };
    },
  };
}

const plan: PaidOrderPlan = {
  order_id: "171482339",
  status: "paid",
  contact: { first_name: "Maria", email: "maria@x.com", phone: "5511987654321" },
  tags: ["lipovitta-comprador", "lip-caps-001"],
  workflow_id: "wf-1",
  pipeline_id: "pipe-1",
  monetary_value: 386.73,
};

describe("runPaidOrderSync", () => {
  it("simulate=true não chama nenhuma escrita e descreve as etapas", async () => {
    const api = fakeApi();
    const globalFetch = vi.spyOn(globalThis, "fetch");
    const result = await runPaidOrderSync(plan, api, true);
    expect(api.calls).toEqual([]);
    expect(globalFetch).not.toHaveBeenCalled();
    expect(result.simulated).toBe(true);
    expect(result.steps.map((s) => s.step)).toEqual([
      "upsert_contact",
      "add_tags",
      "enroll_workflow",
      "upsert_opportunity",
    ]);
    expect(JSON.stringify(result)).not.toContain("maria@x.com");
  });

  it("simulate=false executa as etapas na ordem e cria a oportunidade uma vez", async () => {
    const api = fakeApi();
    const result = await runPaidOrderSync(plan, api, false);
    expect(api.calls).toEqual([
      "upsertContact",
      "addContactTags",
      "enrollContactInWorkflow",
      "findOpportunity",
      "createOpportunity",
    ]);
    expect(result.contact_id).toBe("contact-1");
  });

  it("idempotência: com oportunidade existente atualiza em vez de duplicar", async () => {
    const api = fakeApi();
    api.findOpportunity = async () => {
      api.calls.push("findOpportunity");
      return { id: "opp-existente" };
    };
    const result = await runPaidOrderSync(plan, api, false);
    expect(api.calls).toContain("updateOpportunity");
    expect(api.calls).not.toContain("createOpportunity");
    expect(result.steps.at(-1)?.detail.action).toBe("updated");
  });
});
