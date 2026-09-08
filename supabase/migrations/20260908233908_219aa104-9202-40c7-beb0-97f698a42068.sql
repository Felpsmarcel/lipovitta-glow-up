CREATE OR REPLACE FUNCTION public.daily_report_schedule_status()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _active boolean;
  _schedule text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'forbidden: admin role required';
  END IF;

  SELECT j.active, j.schedule INTO _active, _schedule
  FROM cron.job j
  WHERE j.jobname = 'daily-sales-report-0900-bahia';

  RETURN jsonb_build_object(
    'exists', _schedule IS NOT NULL,
    'active', COALESCE(_active, false),
    'schedule', COALESCE(_schedule, ''),
    'timezone', 'America/Bahia'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.daily_report_schedule_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.daily_report_schedule_status() TO authenticated;