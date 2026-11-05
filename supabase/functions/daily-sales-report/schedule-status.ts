export interface ScheduleReader {
  rpc: (name: 'daily_report_schedule_status') => PromiseLike<{ data: unknown; error: unknown }>;
}

export async function readScheduleStatus(client: ScheduleReader | undefined) {
  const unknown = { found: false, active: false, unknown: true };
  if (!client) return unknown;
  try {
    const { data, error } = await client.rpc('daily_report_schedule_status');
    if (error || !data || typeof data !== 'object') return unknown;
    const value = data as Record<string, unknown>;
    if (typeof value.found !== 'boolean' || typeof value.active !== 'boolean') return unknown;
    return { found: value.found, active: value.active, ...(typeof value.schedule === 'string' ? { schedule: value.schedule } : {}) };
  } catch {
    return unknown;
  }
}