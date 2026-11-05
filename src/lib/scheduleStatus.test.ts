import { describe, expect, it, vi } from 'vitest';
import { readScheduleStatus } from '../../supabase/functions/daily-sales-report/schedule-status';

describe('read-only schedule status', () => {
  it('queries the supplied authenticated client and reads the actual schedule', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { found: true, active: true, schedule: '0 12 * * *' }, error: null });
    expect(await readScheduleStatus({ rpc })).toEqual({ found: true, active: true, schedule: '0 12 * * *' });
    expect(rpc).toHaveBeenCalledWith('daily_report_schedule_status');
  });
  it('does not claim paused or active when the query fails', async () => {
    expect(await readScheduleStatus({ rpc: vi.fn().mockResolvedValue({ data: null, error: { code: '42501' } }) })).toEqual({ found: false, active: false, unknown: true });
  });
  it('handles missing identity and rejected requests without crashing', async () => {
    expect(await readScheduleStatus(undefined)).toEqual({ found: false, active: false, unknown: true });
    expect(await readScheduleStatus({ rpc: vi.fn().mockRejectedValue(new Error('unavailable')) })).toEqual({ found: false, active: false, unknown: true });
  });
});