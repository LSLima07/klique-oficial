import { useEffect, useRef, useState, type ReactNode } from "react";
import { Globe, MessageCircle, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { Reveal } from "../hooks/use-reveal.tsx";
import { SquiggleText } from "./squiggle-text";

/** Tempo de cada pilar no auto-play. */
const AUTOPLAY_MS = 4000;

type CaseItem = {
  id: string;
  pillar: string;
  title: string;
  text: string;
  icon: LucideIcon;
  name: string;
  /** Dados abaixo só aparecem se o print falhar ao carregar (fallback) */
  tag: string;
  accent: string;
  image: string;
  items: { name: string; price: string }[];
};

const CASES: CaseItem[] = [
  {
    id: "brinquedos",
    pillar: "01",
    title: "Presença Digital",
    text: "Sua vitrine aberta 24 horas, com a sua marca e um catálogo que abre rápido até no 4G.",
    icon: Globe,
    name: "Brinquedos & Cia",
    tag: "Loja de brinquedos",
    accent: "#F59E0B",
    image: "https://i.postimg.cc/MHpMjPJz/Vitrine-Colorida-da-Brinquedos-Cia.png",
    items: [
      { name: "Kit de blocos 120 peças", price: "R$ 89" },
      { name: "Carrinho controle remoto", price: "R$ 149" },
      { name: "Boneca articulada", price: "R$ 79" },
    ],
  },
  {
    id: "ultrashake",
    pillar: "02",
    title: "Vendas no WhatsApp",
    text: "O cliente escolhe, monta o carrinho e o pedido chega pronto na sua conversa. Chega de fotos soltas.",
    icon: MessageCircle,
    name: "Ultra Shake",
    tag: "Shakes e açaí",
    accent: "#16A34A",
    image: "https://i.postimg.cc/7hZGTsrH/Poster-Neon-Ultra-Shake.png",
    items: [
      { name: "Shake de morango 500 ml", price: "R$ 18" },
      { name: "Shake proteico", price: "R$ 24" },
      { name: "Açaí 300 ml", price: "R$ 16" },
    ],
  },
  {
    id: "marina",
    pillar: "03",
    title: "Autonomia Total",
    text: "Mude preço, foto e produto sozinho, na hora, sem depender de ninguém para atualizar.",
    icon: SlidersHorizontal,
    name: "Marina Vitória Confeitaria",
    tag: "Confeitaria artesanal",
    accent: "#DB2777",
    image: "https://i.postimg.cc/hvtz7yRc/Landing-Page-de-Confeitaria-Artesanal.png",
    items: [
      { name: "Bolo de pote", price: "R$ 12" },
      { name: "Caixa de brigadeiros", price: "R$ 35" },
      { name: "Torta de limão", price: "R$ 58" },
    ],
  },
];

/* ---------- Mockup ---------- */

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto aspect-[9/19] w-[250px] rounded-[2.6rem] border-[9px] border-[#0B132B] bg-[#0B132B] shadow-[0_30px_60px_-20px_rgba(11,19,43,0.45)] sm:w-[280px]">
      <div
        aria-hidden
        className="absolute left-1/2 top-2 z-20 h-4 w-20 -translate-x-1/2 rounded-full bg-[#0B132B]"
      />
      <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-white">
        {children}
      </div>
    </div>
  );
}

function CaseScreen({ c }: { c: CaseItem }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={c.image}
        alt={`Prévia do site de ${c.name} no celular`}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="h-full w-full select-none object-cover object-top"
      />
    );
  }

  // Fallback: mini-vitrine desenhada em CSS (só aparece se o print não carregar)
  return (
    <div className="flex h-full flex-col bg-white text-[#0B132B]">
      <div className="px-4 pb-3 pt-9">
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.accent }}>
          {c.tag}
        </p>
        <p className="line-clamp-2 text-base font-extrabold leading-tight">{c.name}</p>
      </div>
      <div
        className="mx-4 h-24 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accent}99)` }}
      />
      <ul className="mt-3 space-y-2 px-4">
        {c.items.map((it) => (
          <li
            key={it.name}
            className="flex items-center justify-between gap-2 rounded-xl bg-[#F9FAFB] p-2.5 text-[11px]"
          >
            <span className="line-clamp-1 font-medium">{it.name}</span>
            <span className="shrink-0 font-bold">{it.price}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto p-4">
        <div className="flex items-center justify-center gap-1.5 rounded-full bg-[#FF5A3D] py-2.5 text-xs font-bold text-white">
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          Pedir no WhatsApp
        </div>
      </div>
    </div>
  );
}

/* ---------- Texto dos pilares ---------- */

function PillarText({ c }: { c: CaseItem }) {
  const Icon = c.icon;
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-extrabold tracking-widest text-[#FF5A3D]">{c.pillar}</span>
        <span className="h-px w-10 bg-[#0B132B]/20" />
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5A3D]/10 text-[#FF5A3D]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <h3 className="text-2xl font-extrabold tracking-tight text-[#0B132B] sm:text-3xl">
        {c.pillar} — {c.title}
      </h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-[#0B132B]/70">{c.text}</p>
      <p className="mt-4 text-sm font-semibold text-[#0B132B]/50">Case: {c.name}</p>
    </div>
  );
}

/* ---------- Indicadores (com barra de progresso do auto-play) ---------- */

function Indicators({
  active,
  playing,
  onSelect,
  className = "",
}: {
  active: number;
  playing: boolean;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Cases de clientes"
      className={`flex items-center justify-center gap-1 ${className}`}
    >
      {CASES.map((c, i) => {
        const isActive = active === i;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Ver case ${c.name}`}
            onClick={() => onSelect(i)}
            className="flex h-8 items-center px-1 transition-transform active:scale-90"
          >
            <span
              className={`relative block h-2.5 overflow-hidden rounded-full bg-[#0B132B]/15 transition-all duration-300 ${
                isActive ? "w-10" : "w-2.5"
              }`}
            >
              {isActive && (
                <span
                  key={`${i}-${playing}`}
                  className={`absolute inset-0 origin-left rounded-full bg-[#FF5A3D] ${
                    playing ? "kq-progress" : ""
                  }`}
                  style={playing ? { animationDuration: `${AUTOPLAY_MS}ms` } : undefined}
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Desktop: sticky + scroll ---------- */

function DesktopStory({
  active,
  setActive,
  playing,
  onSelect,
}: {
  active: number;
  setActive: (i: number) => void;
  playing: boolean;
  onSelect: (i: number) => void;
}) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [setActive]);

  return (
    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16">
      <div>
        {CASES.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-index={i}
            className={`flex min-h-[75vh] items-center transition-opacity duration-500 ${
              active === i ? "opacity-100" : "opacity-40"
            }`}
          >
            <PillarText c={c} />
          </div>
        ))}
      </div>

      <div className="sticky top-24 flex h-[calc(100vh-6rem)] flex-col items-center justify-center gap-6 self-start">
        <PhoneFrame>
          {CASES.map((c, i) => (
            <div
              key={c.id}
              aria-hidden={active !== i}
              className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${
                active === i ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
              }`}
            >
              <CaseScreen c={c} />
            </div>
          ))}
        </PhoneFrame>
        <Indicators active={active} playing={playing} onSelect={onSelect} />
      </div>
    </div>
  );
}

/* ---------- Mobile: carrossel tátil ---------- */

function MobileCarousel({
  active,
  setActive,
  paused,
  playing,
  onSelect,
}: {
  active: number;
  setActive: (i: number) => void;
  paused: boolean;
  playing: boolean;
  onSelect: (i: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  // O carrossel informa qual slide está visível (swipe do usuário)
  useEffect(() => {
    const root = scroller.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.slide));
          }
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-slide]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setActive]);

  // Auto-play: só rola sozinho enquanto o visitante não interagiu
  useEffect(() => {
    const root = scroller.current;
    if (!root || paused || !playing) return;
    const current = Math.round(root.scrollLeft / root.clientWidth);
    if (current === active) return;
    root.scrollTo({
      left: active * root.clientWidth,
      // volta do último para o primeiro sem "varrer" os slides do meio
      behavior: Math.abs(current - active) > 1 ? "auto" : "smooth",
    });
  }, [active, paused, playing]);

  const goTo = (i: number) => {
    onSelect(i);
    const root = scroller.current;
    if (!root) return;
    root.scrollTo({ left: i * root.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="lg:hidden">
      <div
        ref={scroller}
        className="kq-no-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {CASES.map((c, i) => (
          <div
            key={c.id}
            data-slide={i}
            className="w-full shrink-0 snap-center px-5"
          >
            <PhoneFrame>
              <CaseScreen c={c} />
            </PhoneFrame>
            <div className="mt-8 text-center [&_p]:mx-auto [&>div>div:first-child]:justify-center">
              <PillarText c={c} />
            </div>
          </div>
        ))}
      </div>

      <Indicators active={active} playing={playing} onSelect={goTo} className="mt-4" />
    </div>
  );
}

/* ---------- Seção ---------- */

export function PhoneScrollytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  const playing = inView && !paused && !reduced;
  const pause = () => setPaused(true);
  const select = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  // Quem prefere menos movimento não recebe auto-play
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // O auto-play só roda com a seção visível; ao sair da tela, ele é "rearmado"
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "-25% 0px -25% 0px",
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) setPaused(false);
  }, [inView]);

  // Rolar a página com a seção na tela = controle manual → pausa
  useEffect(() => {
    if (!inView || paused) return;
    const onScroll = () => setPaused(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [inView, paused]);

  // Avança para o próximo pilar a cada 4 s
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % CASES.length), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [playing, active]);

  return (
    <section
      ref={sectionRef}
      id="demonstracao"
      onPointerDown={pause}
      onWheel={pause}
      onFocusCapture={pause}
      className="bg-[#F9FAFB] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal stagger className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0B132B] sm:text-5xl">
            Veja seu negócio <SquiggleText>vendendo</SquiggleText> no celular do cliente
          </h2>
          <p className="mt-4 text-base text-[#0B132B]/70 sm:text-lg">
            Três pilares que já funcionam em negócios reais como o seu.
          </p>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          <DesktopStory active={active} setActive={setActive} playing={playing} onSelect={select} />
          <MobileCarousel
            active={active}
            setActive={setActive}
            paused={paused}
            playing={playing}
            onSelect={select}
          />
        </div>
      </div>
    </section>
  );
}
