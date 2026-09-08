REVOKE EXECUTE ON FUNCTION public.daily_sales_report(date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.daily_sales_report(date) TO service_role;