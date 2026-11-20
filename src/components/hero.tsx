import { useId, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HERO_SEGMENTS,
  getHeroPreview,
  type HeroSegmentId,
} from "@/lib/hero-segments";
import { VitrineSimulator } from "@/components/vitrine-simulator";
import { Reveal } from "@/hooks/use-reveal";
import { SpotlightCard } from "@/components/spotlight-card";
import { SquiggleText } from "@/components/squiggle-text";

type NicheQuickSelectorProps = {
  selectedSegment: HeroSegmentId;
  onSelect: (segment: HeroSegmentId) => void;
  previewId: string;
};

export function NicheQuickSelector({ selectedSegment, onSelect, previewId }: NicheQuickSelectorProps) {
  function handleSelect(id: HeroSegmentId) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(10);
    onSelect(id);
  }

  return (
    <fieldset className="w-full min-w-0 border-0 p-0">
      <legend className="mb-3 w-full text-center text-sm font-medium text-muted-foreground">
        Qual é o seu negócio?
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
        {HERO_SEGMENTS.map((segment) => {
          const selected = segment.id === selectedSegment;
          return (
            <Button
              key={segment.id}
              type="button"
              variant="outline"
              aria-pressed={selected}
              aria-controls={previewId}
              onClick={() => handleSelect(segment.id)}
              className="kq-shimmer h-auto min-h-12 min-w-0 gap-1.5 rounded-2xl [--kq-shimmer:rgba(255,90,61,0.16)] border-border bg-card px-3 py-3 text-xs text-foreground shadow-none transition-transform duration-150 active:scale-95 motion-reduce:active:scale-100 hover:border-primary/60 hover:bg-primary/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary sm:text-sm"
            >
              <Check aria-hidden="true" className={selected ? "size-4" : "invisible size-4"} />
              <span className="whitespace-normal text-left leading-snug">{segment.label}</span>

            </Button>
          );
        })}
      </div>
    </fieldset>
  );
}

const DOT_MASK = "radial-gradient(ellipse 80% 70% at 50% 0%, #000 35%, transparent 100%)";

export function Hero() {
  const [selectedSegment, setSelectedSegment] = useState<HeroSegmentId>("delivery");
  const id = useId();
  const previewId = `${id}-preview`;
  const headingId = `${id}-heading`;
  const preview = getHeroPreview(selectedSegment);

  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden bg-gradient-to-b from-surface to-background text-foreground"
    >
      {/* Textura de grade pontilhada com fade nas bordas (puro CSS, sem imagem) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(rgba(11,19,43,0.14) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage: DOT_MASK,
          WebkitMaskImage: DOT_MASK,
        }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-14 lg:py-16">
        {/* H1 é o LCP: entra por animação CSS (não espera hidratação do JS) */}
        <h1
          id={headingId}
          className="max-w-4xl text-balance font-display text-3xl font-extrabold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none sm:text-4xl lg:text-5xl"
        >
          O estoque ou cardápio da sua loja direto no{" "}
          <span className="text-primary">
            <SquiggleText>WhatsApp</SquiggleText> do seu cliente.
          </span>{" "}
          Sem complicação.
        </h1>

        <Reveal
          as="p"
          delay={100}
          className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base"
        >
          Seu negócio no celular do cliente, a um klique de vender.
        </Reveal>

        <Reveal
          as="p"
          delay={200}
          className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Criamos a vitrine virtual rápida da sua loja em até 5 dias úteis,
          configuramos seu Google Meu Negócio e deixamos tudo pronto para você só
          responder os clientes.
        </Reveal>

        <Reveal delay={300} className="mt-8 w-full max-w-3xl">
          <NicheQuickSelector selectedSegment={selectedSegment} onSelect={setSelectedSegment} previewId={previewId} />

          <SpotlightCard className="mt-5 border-border bg-card p-5 text-left shadow-soft">
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <MessageCircle aria-hidden="true" className="size-4 text-primary" />
              Exemplo de mensagem do seu cliente
            </div>
            <div id={previewId} role="status" aria-live="polite" aria-atomic="true" className="min-h-24 sm:min-h-16">
              <p key={selectedSegment} className="text-pretty text-base leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none sm:text-lg">
                <strong className="font-semibold">“{preview}”</strong>
              </p>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={400} className="flex w-full flex-col items-center">
          <VitrineSimulator segment={selectedSegment} />
        </Reveal>
      </div>
    </section>
  );
}
