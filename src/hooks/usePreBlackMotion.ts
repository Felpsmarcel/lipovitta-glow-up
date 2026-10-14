import { useEffect, useRef } from "react";

/** Page-local motion, visible without JS, with live reduced-motion support. */
export function usePreBlackMotion() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const animations = new Set<Animation>();
    const elements = Array.from(node.querySelectorAll<HTMLElement>("[data-pb-motion]"));
    let observer: IntersectionObserver | undefined;
    const reveal = (element: HTMLElement) => {
      element.removeAttribute("data-pb-pending");
      if (preference.matches) return;
      const kind = element.dataset.pbMotion;
      const photo = kind === "photo";
      const hero = kind === "hero";
      const animation = element.animate([
        { opacity: 0, transform: photo ? (mobile.matches ? "none" : "scale(1.025)") : `translateY(${mobile.matches ? 8 : 16}px)` },
        { opacity: 1, transform: "none" },
      ], {
        duration: photo ? 700 : hero ? (mobile.matches ? 450 : 600) : 500,
        delay: hero ? Number(element.dataset.pbOrder ?? 0) * 70 : 0,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "backwards",
      });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      elements.forEach(element => element.removeAttribute("data-pb-pending"));
    };
    if (!preference.matches) {
      elements.filter(element => element.dataset.pbMotion !== "scroll").forEach(reveal);
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            reveal(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          });
        }, { threshold: 0.08 });
        elements.filter(element => element.dataset.pbMotion === "scroll").forEach(element => {
          observer?.observe(element);
          element.setAttribute("data-pb-pending", "");
        });
      }
    }
    // Turning motion off reveals everything immediately. Never replay visited content.
    const onPreference = () => { if (preference.matches) stop(); };
    preference.addEventListener("change", onPreference);
    return () => { stop(); preference.removeEventListener("change", onPreference); };
  }, []);
  return root;
}