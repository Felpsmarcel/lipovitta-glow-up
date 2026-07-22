import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/metaPixel";

const MetaPixelRouteTracker = () => {
  const location = useLocation();
  const first = useRef(true);

  useEffect(() => {
    // initMetaPixel() already fires the first PageView; skip duplicate on mount.
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView();
  }, [location.pathname, location.search]);

  return null;
};

export default MetaPixelRouteTracker;
