import { useEffect, useRef, useState, type ReactNode } from "react";
import { Globe, MessageCircle, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { Reveal } from "../hooks/use-reveal";
import { SquiggleText } from "./squiggle-text";

type CaseItem = {
  id: string;
  pillar: string;
  title: string;
  text: string;
  icon: LucideIcon;
  /** Dados do case (usados na prévia caso não exista screenshot) */
  name: string;
  tag: string;
  accent: string;
  /** Troque pelo print real do site: ex. "/cases/brinquedos-e-cia.webp" */
  image?: string;
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
    // image: "/cases/brinquedos-e-cia.webp",
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
    // image: "/cases/ultra-shake.webp",
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
    // image: "/cases/marina-vitoria.webp",
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
  if (c.image) {
    return (
      <img
        src={c.image}
        alt={`Prévia do site de ${c.name}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    );
  }

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

/* ---------- Desktop: sticky + scroll ---------- */

function DesktopStory() {
  const [active, setActive] = useState(0);
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
  }, []);

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

      <div className="sticky top-24 flex h-[calc(100vh-6rem)] items-center self-start">
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
      </div>
    </div>
  );
}

/* ---------- Mobile: carrossel tátil ---------- */

function MobileCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const root = scroller.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSlide(Number((entry.target as HTMLElement).dataset.slide));
          }
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-slide]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
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

      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Cases">
        {CASES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={slide === i}
            aria-label={`Ver case ${c.name}`}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 active:scale-90 ${
              slide === i ? "w-8 bg-[#FF5A3D]" : "w-2.5 bg-[#0B132B]/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Seção ---------- */

export function PhoneScrollytelling() {
  return (
    <section id="demonstracao" className="bg-[#F9FAFB] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0B132B] sm:text-5xl">
            Veja seu negócio <SquiggleText>vendendo</SquiggleText> no celular do cliente
          </h2>
          <p className="mt-4 text-base text-[#0B132B]/70 sm:text-lg">
            Três pilares que já funcionam em negócios reais como o seu.
          </p>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          <DesktopStory />
          <MobileCarousel />
        </div>
      </div>
    </section>
  );
}
