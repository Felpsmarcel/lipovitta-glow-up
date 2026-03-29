import { useEffect, useRef } from "react";

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initially hidden
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate the container
          el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";

          // Animate children with stagger
          const children = el.querySelectorAll("[data-animate]");
          children.forEach((child, i) => {
            const htmlChild = child as HTMLElement;
            htmlChild.style.opacity = "0";
            htmlChild.style.transform = "translateY(16px)";
            setTimeout(() => {
              htmlChild.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
              htmlChild.style.opacity = "1";
              htmlChild.style.transform = "translateY(0)";
            }, 100 * (i + 1));
          });

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
