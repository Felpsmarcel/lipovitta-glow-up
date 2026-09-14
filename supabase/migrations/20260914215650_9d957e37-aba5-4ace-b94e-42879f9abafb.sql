REVOKE ALL ON FUNCTION public.paid_orders_detail(timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.paid_orders_detail(timestamptz, timestamptz) TO service_role;
REVOKE ALL ON FUNCTION public.daily_sales_report(date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.daily_sales_report(date) TO service_role;
REVOKE ALL ON FUNCTION public.gift_display_name(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gift_display_name(text) TO authenticated, service_role;