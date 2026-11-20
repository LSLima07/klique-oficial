import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

/**
 * Revela elementos ao entrar na tela usando apenas IntersectionObserver.
 * 0 kB de biblioteca externa. Respeita prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible } as const;
}

/**
 * Compatibilidade: componentes antigos (ex.: cabeçalho) ainda usam as classes
 * `.reveal` / `.reveal-in` definidas em styles.css. Não remover.
 */
export function revealClass(visible: boolean) {
  return visible ? "reveal reveal-in" : "reveal";
}

/** Direção de entrada: "up" (padrão), deslize lateral ou zoom suave. */
export type RevealFrom = "up" | "left" | "right" | "scale";

type RevealProps = Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "children"> & {
  as?: ElementType;
  /** Atraso em ms (use 100–300 para escalonar cards). */
  delay?: number;
  /** De onde o bloco desliza ao aparecer. */
  from?: RevealFrom;
  /**
   * Cascata: em vez de animar o bloco inteiro, anima cada filho direto
   * em sequência (110 ms entre eles). Ideal para cabeçalhos de seção
   * (rótulo → título → subtítulo). Filhos precisam ser `block`/`flex`
   * (elementos `inline` ignoram transform).
   */
  stagger?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Reveal({
  as: Tag = "div",
  delay = 0,
  from = "up",
  stagger = false,
  className = "",
  style,
  children,
  ...rest
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();
  const Component = Tag as ElementType;

  const motionStyle: CSSProperties = stagger
    ? ({ "--kq-base": `${delay}ms` } as CSSProperties)
    : { transitionDelay: delay ? `${delay}ms` : undefined };

  return (
    <Component
      {...rest}
      ref={ref}
      data-visible={visible}
      data-from={!stagger && from !== "up" ? from : undefined}
      className={`${stagger ? "kq-stagger" : "kq-reveal"} ${className}`}
      style={{ ...motionStyle, ...style }}
    >
      {children}
    </Component>
  );
}
