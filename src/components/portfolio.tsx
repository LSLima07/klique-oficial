import { ArrowRight, CupSoda, Gift, Leaf, CakeSlice, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/hooks/use-reveal";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/spotlight-card";
import { SquiggleText } from "@/components/squiggle-text";
import { buildWhatsappUrl } from "@/lib/whatsapp";

type Project = {
  name: string;
  niche: string;
  city: string;
  icon: LucideIcon;
  description: string;
  highlights: string[];
  url?: string;
  logoUrl?: string;
};

const projects: Project[] = [
  {
    name: "Ultra Shake",
    niche: "Delivery",
    city: "Angatuba",
    icon: CupSoda,
    description:
      "Modelo Delivery: Cardápio rápido, cálculo de adicionais e envio direto no WhatsApp.",
    highlights: ["Escolha rápida no cardápio", "Adicionais calculados automaticamente", "Pedido enviado ao WhatsApp"],
    url: "https://ultra-shake-a-a.vercel.app",
    logoUrl: undefined,
  },
  {
    name: "Brinquedos & Cia",
    niche: "Presentes",
    city: "Angatuba",
    icon: Gift,
    description:
      "Modelo Catálogo: Vitrine de 23 produtos com busca instantânea, filtros por idade e aviso de esgotado.",
    highlights: ["Busca instantânea entre 23 produtos", "Filtros por faixa etária", "Aviso de produtos esgotados"],
    url: "https://brinquedos-cia.vercel.app",
    logoUrl: undefined,
  },
  {
    name: "BioViva",
    niche: "Educação",
    city: "Angatuba",
    icon: Leaf,
    description: "Plataforma Educacional: Projeto comunitário interativo com ranking, quizzes e acessibilidade.",
    highlights: ["Quizzes interativos", "Ranking da comunidade", "Recursos de acessibilidade"],
    url: "https://bioviva.vercel.app",
    logoUrl: undefined,
  },
  {
    name: "Confeitaria Artesanal",
    niche: "Encomendas",
    city: "Angatuba",
    icon: CakeSlice,
    description: "Modelo Encomendas: Vitrine visual de doces e bolos caseiros feita sob medida para pedidos rápidos.",
    highlights: ["Doces e bolos caseiros", "Vitrine visual sob medida", "Encomendas rápidas"],
    url: "https://marina-vit-ria-confeitaria.vercel.app/",
    logoUrl: undefined,
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Casos de sucesso</span>
          <h2 id="portfolio-title" className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Projetos reais que conectam <SquiggleText>Angatuba</SquiggleText>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Do cardápio à educação: cada projeto com o modelo certo para seu público.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = project.icon;
  return (
    <Reveal as="article" delay={index * 140} className="h-full">
      <SpotlightCard className="h-full rounded-3xl border-border bg-card p-8 shadow-soft duration-300 hover:-translate-y-1">
        <div className="flex h-full flex-col">
          <div className="flex justify-end">
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              {project.niche} • {project.city}
            </span>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface p-1 text-primary">
              {project.logoUrl ? (
                <img src={project.logoUrl} alt="" width={32} height={32} loading="lazy" className="size-8 object-contain" />
              ) : (
                <Icon aria-hidden="true" className="size-6" />
              )}
            </span>
            <h3 className="min-w-0 font-display text-2xl font-bold tracking-tight">{project.name}</h3>
          </div>
          <p className="mt-2 leading-relaxed text-muted-foreground">{project.description}</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
          <Button
            asChild
            variant="outline"
            className="group/btn mt-8 h-auto w-fit rounded-full px-5 py-2.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 active:scale-95 motion-reduce:transition-none"
          >
            <a
              href={project.url ?? buildWhatsappUrl(`Olá, Klique! Quero conhecer o projeto ${project.name} e criar uma solução parecida.`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.url ? "Ver site de" : "Conhecer"} ${project.name} (abre em nova aba)`}
            >
              {project.url ? "Ver site" : "Conhecer projeto"}
              {project.url ? (
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              ) : (
                <MessageCircle aria-hidden="true" className="size-4" />
              )}
            </a>
          </Button>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}
