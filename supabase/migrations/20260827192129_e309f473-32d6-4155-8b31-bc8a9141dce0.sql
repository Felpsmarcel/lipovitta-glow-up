REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mcp_conversion_summary(integer, boolean) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mcp_sales_metrics(integer, boolean) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mcp_tracking_health(integer, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.mcp_conversion_summary(integer, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.mcp_sales_metrics(integer, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.mcp_tracking_health(integer, boolean) TO service_role;