CREATE OR REPLACE FUNCTION public.daily_report_schedule_status()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _row record;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'forbidden: admin role required';
  END IF;

  SELECT jobname, schedule, active INTO _row
  FROM cron.job
  WHERE jobname = 'daily-sales-report-0900-bahia'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false, 'active', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'active', _row.active,
    'schedule', _row.schedule,
    'job_name', _row.jobname
  );
END;
$$;

REVOKE ALL ON FUNCTION public.daily_report_schedule_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.daily_report_schedule_status() TO authenticated, service_role;