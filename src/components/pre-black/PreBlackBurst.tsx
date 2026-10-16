import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "pb-burst-v1";

function alreadyPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // sessionStorage indisponível: a página funciona normalmente, sem burst.
    return true;
  }
}

function markPlayed() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* sem storage: apenas não repete nesta montagem */
  }
}

/**
 * Explosão de energia contida no hero da Pré Black: glow + anel + fragmentos
 * abstratos azul/verde, uma única vez por sessão. Decorativa (pointer-events
 * none, aria-hidden), nunca bloqueia o conteúdo. Respeita reduced-motion
 * inclusive com mudança em runtime e limpa timers/animações ao desmontar.
 */
export default function PreBlackBurst({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  // Conteúdo visível por padrão; a ocultação inicial só é aplicada depois
  // que a animação está preparada (no effect), evitando flash ou tela vazia.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const shouldPlay = !alreadyPlayed() && !preference.matches;
    if (!shouldPlay) {
      setReady(true);
      return;
    }

    markPlayed();
    setReady(true);

    const ease = "cubic-bezier(.22,1,.36,1)";
    const animations: Animation[] = [];
    const animate = (el: Element | null, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!el) return;
      const a = el.animate(frames, { ...options, fill: "both" });
      animations.push(a);
    };

    const glow = node.querySelector("[data-pb-burst='glow']");
    const ring = node.querySelector("[data-pb-burst='ring']");
    const fragments = Array.from(node.querySelectorAll("[data-pb-burst='fragment']"));
    const product = node.querySelector("[data-pb-burst='product']");
    const copy = Array.from(node.querySelectorAll("[data-pb-burst='copy']"));

    // Glow concentrado atrás do kit: 0–250ms
    animate(glow, [
      { opacity: 0, transform: "scale(.6)" },
      { opacity: 1, transform: "scale(1)", offset: 0.2 },
      { opacity: 0.55, transform: "scale(1.05)" },
    ], { duration: 1200, easing: "ease-out" });

    // Anel expande: 250–850ms
    animate(ring, [
      { opacity: 0.9, transform: "scale(.35)" },
      { opacity: 0, transform: "scale(1.6)" },
    ], { duration: 600, delay: 250, easing: "ease-out" });

    // Fragmentos abstratos azul/verde: 250–850ms (6–8 no mobile, 14 no desktop)
    const visible = fragments.filter((_, i) => (mobile.matches ? i % 2 === 0 : true));
    const amplitude = mobile.matches ? 90 : 170;
    visible.forEach((el, i) => {
      const angle = (i / visible.length) * Math.PI * 2;
      const x = Math.cos(angle) * amplitude;
      const y = Math.sin(angle) * amplitude * 0.7;
      animate(el, [
        { opacity: 0, transform: "translate(0,0) scale(.4) rotate(0deg)" },
        { opacity: 1, offset: 0.25 },
        { opacity: 0, transform: `translate(${x.toFixed(0)}px,${y.toFixed(0)}px) scale(1) rotate(${i % 2 ? 40 : -40}deg)` },
      ], { duration: 600, delay: 250, easing: "ease-out" });
    });

    // Produto aproxima sutilmente, sem distorção: 400–1000ms
    animate(product, [
      { opacity: 0, transform: "scale(.96)" },
      { opacity: 1, transform: "scale(1)" },
    ], { duration: 600, delay: 400, easing: ease });

    // Copy e CTA: deslocamento máximo 16px, stagger 60ms, 600–1200ms
    copy.forEach((el, i) => {
      animate(el, [
        { opacity: 0, transform: `translateY(${mobile.matches ? 8 : 16}px)` },
        { opacity: 1, transform: "none" },
      ], { duration: 450, delay: 600 + i * 60, easing: ease });
    });

    // Mudança de reduced-motion em runtime: interrompe tudo e mostra o estado final.
    const onPreference = () => {
      if (preference.matches) animations.forEach((a) => a.cancel());
    };
    preference.addEventListener("change", onPreference);
    return () => {
      preference.removeEventListener("change", onPreference);
      animations.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <div ref={root} className="pb-burst" data-pb-burst-root={ready ? "ready" : undefined}>
      <div className="pb-burst-fx" aria-hidden="true">
        <span data-pb-burst="glow" className="pb-burst-glow" />
        <span data-pb-burst="ring" className="pb-burst-ring" />
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} data-pb-burst="fragment" className={`pb-burst-fragment pb-burst-fragment-${i % 3}`} />
        ))}
      </div>
      {children}
    </div>
  );
}
