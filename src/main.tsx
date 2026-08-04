import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initMetaPixel } from "@/lib/metaPixel";
import { captureUtms } from "@/lib/tracking";

initMetaPixel();
captureUtms();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
