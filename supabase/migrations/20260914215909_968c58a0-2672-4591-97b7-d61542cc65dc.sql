DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sandbox_exec') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.daily_sales_report(date) TO sandbox_exec';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.paid_orders_detail(timestamptz, timestamptz) TO sandbox_exec';
  END IF;
END $$;