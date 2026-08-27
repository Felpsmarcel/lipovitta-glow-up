REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.mcp_conversion_summary(integer, boolean) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.mcp_sales_metrics(integer, boolean) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.mcp_tracking_health(integer, boolean) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mcp_conversion_summary(integer, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mcp_sales_metrics(integer, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mcp_tracking_health(integer, boolean) TO authenticated;