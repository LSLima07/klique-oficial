import type { ReactNode } from "react";
import { useReveal } from "../hooks/use-reveal";

/**
 * Destaca uma palavra-chave com sublinhado orgânico coral que "desenha" ao entrar na tela.
 * Uso: <h1>Seu negócio a um <SquiggleText>klique</SquiggleText> de vender</h1>
 */
export function SquiggleText({ children }: { children: ReactNode }) {
  const { ref, visible } = useReveal<HTMLSpanElement>({ threshold: 0.6, rootMargin: "0px" });

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        data-visible={visible}
        className="kq-squiggle pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.38em] w-full"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M2 8 C 28 2, 52 12, 82 6 S 132 2, 160 7 S 190 10, 198 4"
          pathLength={1}
          stroke="#FF5A3D"
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
