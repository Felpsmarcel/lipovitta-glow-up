REVOKE EXECUTE ON FUNCTION public.daily_report_schedule_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.daily_report_schedule_status() TO authenticated;
COMMENT ON FUNCTION public.daily_report_schedule_status() IS 'Read-only schedule status; execution requires an authenticated session and the function enforces has_role(auth.uid(), admin).';