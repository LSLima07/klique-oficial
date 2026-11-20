import { useEffect, useRef } from "react";

/**
 * Luz ambiente global (coral + azul-celeste) fixa na viewport.
 * - Desktop (mouse): segue o cursor com inércia.
 * - Celular (toque): acompanha a rolagem, percorrendo a tela conforme o progresso da página.
 * Só anima `transform` (GPU) via requestAnimationFrame e para quando alcança o alvo.
 * Fica abaixo do cabeçalho (z-50) e dos modais, e não intercepta cliques.
 */
export function GlobalSpotlight() {
  const coral = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = coral.current;
    const b = sky.current;
    if (!a || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    // alvo e posições atuais (a = coral, b = azul-celeste, que "arrasta" mais devagar)
    let tx = vw * 0.7;
    let ty = vh * 0.25;
    let ax = tx;
    let ay = ty;
    let bx = tx;
    let by = ty;
    let raf = 0;

    const paint = () => {
      ax += (tx - ax) * 0.09;
      ay += (ty - ay) * 0.09;
      bx += (tx - bx) * 0.05;
      by += (ty - by) * 0.05;
      a.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
      b.style.transform = `translate3d(${(bx + 120).toFixed(1)}px, ${(by + 80).toFixed(1)}px, 0)`;
      const moving =
        Math.abs(tx - ax) > 0.4 || Math.abs(ty - ay) > 0.4 || Math.abs(tx - bx) > 0.4 || Math.abs(ty - by) > 0.4;
      raf = moving ? requestAnimationFrame(paint) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      kick();
    };

    // Toque: a luz percorre a tela conforme o progresso da rolagem (0 → 1)
    const followScroll = () => {
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? window.scrollY / max : 0;
      tx = vw * (0.5 + 0.35 * Math.sin(p * Math.PI * 6));
      ty = vh * (0.5 + 0.3 * Math.cos(p * Math.PI * 5));
      kick();
    };

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      if (!fine) followScroll();
    };

    window.addEventListener("resize", onResize, { passive: true });
    if (fine) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    } else {
      window.addEventListener("scroll", followScroll, { passive: true });
      followScroll();
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", followScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* Coral */}
      <div
        ref={coral}
        className="absolute left-0 top-0 h-0 w-0 will-change-transform"
        style={{ transform: "translate3d(70vw, 25vh, 0)" }}
      >
        <div
          className="kq-aura-float absolute -left-[260px] -top-[260px] size-[520px] rounded-full sm:-left-[340px] sm:-top-[340px] sm:size-[680px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,90,61,0.13) 0%, rgba(255,90,61,0.05) 42%, transparent 70%)",
          }}
        />
      </div>

      {/* Azul-celeste (levemente deslocado e mais lento) */}
      <div
        ref={sky}
        className="absolute left-0 top-0 h-0 w-0 will-change-transform"
        style={{ transform: "translate3d(calc(70vw + 120px), calc(25vh + 80px), 0)" }}
      >
        <div
          className="kq-aura-float kq-aura-float-alt absolute -left-[200px] -top-[200px] size-[400px] rounded-full sm:-left-[280px] sm:-top-[280px] sm:size-[560px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.05) 45%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
