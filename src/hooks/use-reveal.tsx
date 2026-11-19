import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
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

type RevealProps = {
  as?: ElementType;
  /** Atraso em ms (use 100–300 para escalonar cards). */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
  children,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();
  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      data-visible={visible}
      className={`kq-reveal ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Component>
  );
}
