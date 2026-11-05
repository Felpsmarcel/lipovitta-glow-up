-- Compensating rollback of 0001_restore_admin_schedule_read; retain the applied history.
-- Historical 20260915162826 revoked authenticated EXECUTE; service_role and owner were preexisting.
REVOKE EXECUTE ON FUNCTION public.daily_report_schedule_status() FROM authenticated;
-- No earlier COMMENT is recorded in the function's repository history. Remove only our exact comment.
DO $$
BEGIN
  IF obj_description('public.daily_report_schedule_status()'::regprocedure, 'pg_proc') = 'Read-only schedule status; execution requires an authenticated session and the function enforces has_role(auth.uid(), admin).' THEN
    COMMENT ON FUNCTION public.daily_report_schedule_status() IS NULL;
  END IF;
END;
$$;