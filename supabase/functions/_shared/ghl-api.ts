/**
 * Cliente compartilhado da API direta do HighLevel (GoHighLevel).
 *
 * Espelho de `src/lib/ghlApi.ts` (Edge Functions não podem importar de `src/`).
 * Os testes vivem em `src/lib/ghlApi.test.ts` — mantenha as duas cópias iguais.
 *
 * Regras:
 * - nenhum token no código: sempre lido de secret/env em tempo de execução;
 * - fail closed: sem token/location configurados nada é executado;
 * - nada de PII completa nem secrets em log.
 */

import { maskEmail, maskPhone } from "./privacy.ts";

export const GHL_API_BASE = "https://services.leadconnectorhq.com";
/** Subconta LipoVitta — fallback explícito apenas para o location id. */
export const GHL_DEFAULT_LOCATION_ID = "fJzQmnIkw2U71SbtBDld";

type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

function runtimeEnv(name: string): string | undefined {
  const runtime = globalThis as RuntimeGlobals;
  return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}

function firstEnv(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = runtimeEnv(name)?.trim();
    if (value) return value;
  }
  return undefined;
}

export class GhlApiError extends Error {
  readonly status: number;
  readonly details: unknown;
  constructor(message: string, status = 0, details: unknown = null) {
    super(message);
    this.name = "GhlApiError";
    this.status = status;
    this.details = details;
  }
}

/** Token da integração privada (preferido) ou access token OAuth (fallback). */
export function ghlToken(): string | undefined {
  return firstEnv(["GHL_PRIVATE_INTEGRATION_TOKEN", "GHL_ACCESS_TOKEN"]);
}

export function ghlLocationId(): string {
  return firstEnv(["GHL_LOCATION_ID"]) ?? GHL_DEFAULT_LOCATION_ID;
}

export type GhlConfigStatus = {
  token_configured: boolean;
  token_source: "GHL_PRIVATE_INTEGRATION_TOKEN" | "GHL_ACCESS_TOKEN" | null;
  location_configured: boolean;
  location_source: "GHL_LOCATION_ID" | "fallback_lipovitta";
  location_id_suffix: string;
  direct_api_ready: boolean;
  webhook_configured: boolean;
};

/** Diagnóstico sem qualquer valor sensível. */
export function ghlConfigStatus(): GhlConfigStatus {
  const priv = runtimeEnv("GHL_PRIVATE_INTEGRATION_TOKEN")?.trim();
  const access = runtimeEnv("GHL_ACCESS_TOKEN")?.trim();
  const explicitLocation = runtimeEnv("GHL_LOCATION_ID")?.trim();
  const location = explicitLocation || GHL_DEFAULT_LOCATION_ID;
  const tokenConfigured = Boolean(priv || access);
  return {
    token_configured: tokenConfigured,
    token_source: priv ? "GHL_PRIVATE_INTEGRATION_TOKEN" : access ? "GHL_ACCESS_TOKEN" : null,
    location_configured: Boolean(location),
    location_source: explicitLocation ? "GHL_LOCATION_ID" : "fallback_lipovitta",
    location_id_suffix: location.slice(-4),
    direct_api_ready: tokenConfigured && Boolean(location),
    webhook_configured: Boolean(runtimeEnv("GHL_WEBHOOK_URL")?.trim()),
  };
}

/** Lança erro claro quando a API direta não pode ser usada (fail closed). */
export function requireGhlConfig(): { token: string; locationId: string } {
  const token = ghlToken();
  const locationId = ghlLocationId();
  if (!token)
    throw new GhlApiError(
      "GHL_PRIVATE_INTEGRATION_TOKEN (ou GHL_ACCESS_TOKEN) não configurado — configure o segredo antes de usar a API direta do HighLevel.",
      412,
    );
  if (!locationId) throw new GhlApiError("GHL_LOCATION_ID não configurado.", 412);
  return { token, locationId };
}

export type GhlRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  /** Versão da API HighLevel (header `Version`). */
  version?: string;
  fetchImpl?: typeof fetch;
};

/** Request genérico ao HighLevel, com erros normalizados. */
export async function ghlRequest<T = unknown>(
  path: string,
  options: GhlRequestOptions = {},
): Promise<T> {
  const { token } = requireGhlConfig();
  const { method = "GET", body, query, version = "2021-07-28", fetchImpl } = options;
  const doFetch = fetchImpl ?? fetch;
  const url = new URL(path.startsWith("http") ? path : `${GHL_API_BASE}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  let response: Response;
  try {
    response = await doFetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Version: version,
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (e) {
    throw new GhlApiError(`Falha de rede ao chamar o HighLevel: ${(e as Error).message}`, 0);
  }
  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text.slice(0, 500) };
    }
  }
  if (!response.ok) {
    const detail =
      (parsed as { message?: unknown; error?: unknown } | null)?.message ??
      (parsed as { error?: unknown } | null)?.error ??
      text.slice(0, 300);
    throw new GhlApiError(
      `HighLevel respondeu ${response.status} em ${method} ${url.pathname}: ${String(detail)}`,
      response.status,
      parsed,
    );
  }
  return parsed as T;
}

/* ------------------------------------------------------------------ */
/* Helpers puros                                                       */
/* ------------------------------------------------------------------ */

/** Normaliza uma tag: minúscula, sem acento, hífens no lugar de separadores. */
export function sanitizeTag(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Lista de tags única, sanitizada e sem vazios (idempotente por natureza). */
export function normalizeTags(tags: readonly unknown[] | undefined | null): string[] {
  const seen = new Set<string>();
  for (const tag of tags ?? []) {
    const clean = sanitizeTag(tag);
    if (clean) seen.add(clean);
  }
  return [...seen];
}

export type OrderItemLike = { sku?: unknown; name?: unknown } | null | undefined;

/** Tags seguras de um pedido pago: marcador de comprador + produtos/SKUs. */
export function buildOrderTags(items: readonly OrderItemLike[] | undefined | null, extra: readonly string[] = []): string[] {
  const productTags = (items ?? []).map((item) => sanitizeTag(item?.sku ?? item?.name));
  return normalizeTags(["lipovitta-comprador", ...productTags, ...extra]);
}

export type ContactInput = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
};

/**
 * Payload de `POST /contacts/upsert`.
 * Nunca inclui `tags`: elas são tratadas separadamente por Add/Remove Tags
 * para não sobrescrever as tags já existentes no contato.
 */
export function buildUpsertContactPayload(input: ContactInput, locationId: string): Record<string, unknown> {
  const payload: Record<string, unknown> = { locationId };
  if (input.first_name?.trim()) payload.firstName = input.first_name.trim();
  if (input.last_name?.trim()) payload.lastName = input.last_name.trim();
  if (input.email?.trim()) payload.email = input.email.trim().toLowerCase();
  if (input.phone?.trim()) payload.phone = input.phone.trim();
  if (input.source?.trim()) payload.source = input.source.trim();
  return payload;
}

/** Versão mascarada de um contato, segura para logs e retorno de simulação. */
export function maskContact(input: ContactInput): Record<string, string> {
  return {
    first_name: input.first_name ? `${input.first_name.trim().slice(0, 1)}***` : "",
    last_name: input.last_name ? `${input.last_name.trim().slice(0, 1)}***` : "",
    email: maskEmail(input.email),
    phone: maskPhone(input.phone),
  };
}

export const PAID_ORDER_STATUSES = ["paid", "approved"] as const;

export type OrderLike = { order_id?: unknown; status?: unknown } | null | undefined;

/** Somente pedido pago é elegível a automações de pós-compra. */
export function assertPaidOrder(order: OrderLike): { order_id: string; status: string } {
  if (!order) throw new GhlApiError("Pedido não encontrado em yampi_orders.", 404);
  const status = String(order.status ?? "").trim().toLowerCase();
  if (!(PAID_ORDER_STATUSES as readonly string[]).includes(status))
    throw new GhlApiError(
      `Pedido ${String(order.order_id ?? "")} está com status "${status || "desconhecido"}" — somente pedidos pagos (paid/approved) podem ser sincronizados.`,
      409,
    );
  return { order_id: String(order.order_id ?? ""), status };
}

/* ------------------------------------------------------------------ */
/* Helpers de API                                                      */
/* ------------------------------------------------------------------ */

export type GhlWorkflow = {
  id?: string;
  name?: string;
  status?: string;
  version?: number | string;
  updatedAt?: string;
};

export async function listWorkflows(
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<GhlWorkflow[]> {
  const { locationId } = requireGhlConfig();
  const data = await ghlRequest<{ workflows?: GhlWorkflow[] }>("/workflows/", {
    query: { locationId },
    fetchImpl: opts.fetchImpl,
  });
  return data?.workflows ?? [];
}

export type UpsertContactResult = {
  contact_id: string | null;
  new: boolean;
  raw: unknown;
};

export async function upsertContact(
  input: ContactInput,
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<UpsertContactResult> {
  const { locationId } = requireGhlConfig();
  const data = await ghlRequest<{ contact?: { id?: string }; new?: boolean }>("/contacts/upsert", {
    method: "POST",
    body: buildUpsertContactPayload(input, locationId),
    fetchImpl: opts.fetchImpl,
  });
  return { contact_id: data?.contact?.id ?? null, new: Boolean(data?.new), raw: data };
}

export async function addContactTags(
  contactId: string,
  tags: readonly string[],
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<unknown> {
  return ghlRequest(`/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: "POST",
    body: { tags: normalizeTags(tags) },
    fetchImpl: opts.fetchImpl,
  });
}

export async function removeContactTags(
  contactId: string,
  tags: readonly string[],
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<unknown> {
  return ghlRequest(`/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: "DELETE",
    body: { tags: normalizeTags(tags) },
    fetchImpl: opts.fetchImpl,
  });
}

export async function enrollContactInWorkflow(
  contactId: string,
  workflowId: string,
  eventStartTime?: string,
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<unknown> {
  return ghlRequest(
    `/contacts/${encodeURIComponent(contactId)}/workflow/${encodeURIComponent(workflowId)}`,
    {
      method: "POST",
      body: { eventStartTime: eventStartTime ?? new Date().toISOString() },
      fetchImpl: opts.fetchImpl,
    },
  );
}

export async function removeContactFromWorkflow(
  contactId: string,
  workflowId: string,
  eventStartTime?: string,
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<unknown> {
  return ghlRequest(
    `/contacts/${encodeURIComponent(contactId)}/workflow/${encodeURIComponent(workflowId)}`,
    {
      method: "DELETE",
      body: { eventStartTime: eventStartTime ?? new Date().toISOString() },
      fetchImpl: opts.fetchImpl,
    },
  );
}

export type OpportunityInput = {
  contact_id: string;
  pipeline_id: string;
  name: string;
  status: string;
  pipeline_stage_id?: string | null;
  monetary_value?: number | null;
  assigned_to?: string | null;
  opportunity_id?: string | null;
};

export function buildOpportunityPayload(
  input: OpportunityInput,
  locationId: string,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    pipelineId: input.pipeline_id,
    locationId,
    name: input.name,
    status: input.status,
    contactId: input.contact_id,
  };
  if (input.pipeline_stage_id) payload.pipelineStageId = input.pipeline_stage_id;
  if (typeof input.monetary_value === "number") payload.monetaryValue = input.monetary_value;
  if (input.assigned_to) payload.assignedTo = input.assigned_to;
  return payload;
}

/** Procura uma oportunidade do contato no mesmo pipeline (evita duplicata). */
export async function findOpportunity(
  contactId: string,
  pipelineId: string,
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<{ id?: string; name?: string; status?: string } | null> {
  const { locationId } = requireGhlConfig();
  try {
    const data = await ghlRequest<{ opportunities?: { id?: string; name?: string; status?: string; pipelineId?: string }[] }>(
      "/opportunities/search",
      {
        query: { location_id: locationId, contact_id: contactId, pipeline_id: pipelineId, limit: 20 },
        fetchImpl: opts.fetchImpl,
      },
    );
    const found = (data?.opportunities ?? []).find((o) => !o.pipelineId || o.pipelineId === pipelineId);
    return found ?? null;
  } catch (e) {
    // Busca indisponível não deve impedir a criação; apenas perde a deduplicação.
    if (e instanceof GhlApiError && e.status >= 400 && e.status < 500) return null;
    throw e;
  }
}

export async function createOpportunity(
  input: OpportunityInput,
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<{ id?: string } & Record<string, unknown>> {
  const { locationId } = requireGhlConfig();
  const data = await ghlRequest<{ opportunity?: Record<string, unknown> }>("/opportunities/", {
    method: "POST",
    body: buildOpportunityPayload(input, locationId),
    version: "2021-07-28",
    fetchImpl: opts.fetchImpl,
  });
  return (data?.opportunity ?? data ?? {}) as { id?: string };
}

export async function updateOpportunity(
  opportunityId: string,
  input: OpportunityInput,
  opts: { fetchImpl?: typeof fetch } = {},
): Promise<{ id?: string } & Record<string, unknown>> {
  const { locationId } = requireGhlConfig();
  const body = buildOpportunityPayload(input, locationId);
  delete body.locationId;
  const data = await ghlRequest<{ opportunity?: Record<string, unknown> }>(
    `/opportunities/${encodeURIComponent(opportunityId)}`,
    { method: "PUT", body, fetchImpl: opts.fetchImpl },
  );
  return (data?.opportunity ?? data ?? {}) as { id?: string };
}

/* ------------------------------------------------------------------ */
/* Orquestração de pedido pago (injetável para teste)                  */
/* ------------------------------------------------------------------ */

export type PaidOrderPlan = {
  order_id: string;
  status: string;
  contact: ContactInput;
  tags: string[];
  workflow_id?: string | null;
  pipeline_id?: string | null;
  pipeline_stage_id?: string | null;
  opportunity_name?: string | null;
  monetary_value?: number | null;
};

export type PaidOrderStep = {
  step: string;
  simulated: boolean;
  detail: Record<string, unknown>;
};

export type PaidOrderApi = {
  upsertContact: (input: ContactInput) => Promise<UpsertContactResult>;
  addContactTags: (contactId: string, tags: string[]) => Promise<unknown>;
  enrollContactInWorkflow: (contactId: string, workflowId: string) => Promise<unknown>;
  findOpportunity: (
    contactId: string,
    pipelineId: string,
  ) => Promise<{ id?: string } | null>;
  createOpportunity: (input: OpportunityInput) => Promise<{ id?: string }>;
  updateOpportunity: (id: string, input: OpportunityInput) => Promise<{ id?: string }>;
};

/**
 * Executa (ou apenas descreve, quando `simulate`) as etapas de sincronização de
 * um pedido pago. Com `simulate=true` NENHUMA chamada de escrita é feita.
 */
export async function runPaidOrderSync(
  plan: PaidOrderPlan,
  api: PaidOrderApi,
  simulate: boolean,
): Promise<{ simulated: boolean; order_id: string; contact_id: string | null; steps: PaidOrderStep[] }> {
  const steps: PaidOrderStep[] = [];
  let contactId: string | null = null;

  if (simulate) {
    steps.push({
      step: "upsert_contact",
      simulated: true,
      detail: { contact: maskContact(plan.contact) },
    });
  } else {
    const result = await api.upsertContact(plan.contact);
    contactId = result.contact_id;
    steps.push({
      step: "upsert_contact",
      simulated: false,
      detail: { contact_id: contactId, new: result.new, contact: maskContact(plan.contact) },
    });
    if (!contactId)
      return { simulated: false, order_id: plan.order_id, contact_id: null, steps };
  }

  if (plan.tags.length) {
    if (simulate) {
      steps.push({ step: "add_tags", simulated: true, detail: { tags: plan.tags } });
    } else if (contactId) {
      await api.addContactTags(contactId, plan.tags);
      steps.push({ step: "add_tags", simulated: false, detail: { tags: plan.tags } });
    }
  }

  if (plan.workflow_id) {
    if (simulate) {
      steps.push({ step: "enroll_workflow", simulated: true, detail: { workflow_id: plan.workflow_id } });
    } else if (contactId) {
      await api.enrollContactInWorkflow(contactId, plan.workflow_id);
      steps.push({ step: "enroll_workflow", simulated: false, detail: { workflow_id: plan.workflow_id } });
    }
  }

  if (plan.pipeline_id) {
    const oppInput: OpportunityInput = {
      contact_id: contactId ?? "(simulado)",
      pipeline_id: plan.pipeline_id,
      name: plan.opportunity_name || `Pedido ${plan.order_id}`,
      status: "won",
      pipeline_stage_id: plan.pipeline_stage_id ?? null,
      monetary_value: plan.monetary_value ?? null,
    };
    if (simulate)
      steps.push({
        step: "upsert_opportunity",
        simulated: true,
        detail: { pipeline_id: plan.pipeline_id, name: oppInput.name, monetary_value: oppInput.monetary_value },
      });
    else {
      const existing = await api.findOpportunity(contactId!, plan.pipeline_id);
      const result = existing?.id
        ? await api.updateOpportunity(existing.id, oppInput)
        : await api.createOpportunity(oppInput);
      steps.push({
        step: "upsert_opportunity",
        simulated: false,
        detail: {
          opportunity_id: result?.id ?? existing?.id ?? null,
          action: existing?.id ? "updated" : "created",
          monetary_value: oppInput.monetary_value,
        },
      });
    }
  }

  return { simulated: simulate, order_id: plan.order_id, contact_id: contactId, steps };
}
