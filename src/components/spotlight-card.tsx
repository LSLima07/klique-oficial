import { useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Card com brilho coral que segue o cursor (--mouse-x / --mouse-y) e ilumina a borda.
 * As variáveis CSS são atualizadas direto no elemento (sem re-render do React).
 * Em touch: feedback tátil com active:scale-[0.98].
 */
export function SpotlightCard({
  children,
  className = "",
  onPointerMove,
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (e.pointerType !== "mouse") return;

    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
      el.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={twMerge(
        "group relative overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-150 active:scale-[0.98]",
        className,
      )}
      {...rest}
    >
      {/* Brilho radial suave */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,90,61,0.12), transparent 65%)",
        }}
      />
      {/* Borda iluminada */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          padding: "1px",
          background:
            "radial-gradient(260px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,90,61,0.6), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
