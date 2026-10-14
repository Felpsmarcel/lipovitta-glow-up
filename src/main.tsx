import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initMetaPixel } from "@/lib/metaPixel";
import { captureUtms } from "@/lib/tracking";

// Benign browser notice (layout changed mid-frame); it never breaks the page,
// so stop it from surfacing as a fatal runtime error.
window.addEventListener("error", (event) => {
  if (event.message?.includes("ResizeObserver loop")) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

initMetaPixel();
captureUtms();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
