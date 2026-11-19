import { Check, Lightbulb, MessageCircle, Server } from "lucide-react";
import { PLANS, OPTIONAL_SUPPORT_MONTHLY, formatBRL, getPlanWhatsappUrl } from "@/lib/plans";
import { Reveal } from "@/hooks/use-reveal";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/spotlight-card";
import { SquiggleText } from "@/components/squiggle-text";

export function Pricing() {
  return (
    <section id="orcamento" aria-labelledby="planos-title" className="border-t border-border bg-background py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase text-primary">Taxa única</span>
          <h2 id="planos-title" className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Sua presença digital.{" "}
            <span className="text-primary">
              Sem <SquiggleText>mensalidade</SquiggleText> obrigatória.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Para o comércio local e para quem quer colocar suas ideias e serviços na internet.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal
              key={plan.id}
              as="article"
              aria-labelledby={`plano-${plan.id}`}
              delay={i * 120}
              className="relative h-full min-w-0"
            >
              {/* Selo fica fora do SpotlightCard (que usa overflow-hidden) para não ser cortado */}
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-coral">
                  Mais escolhido
                </span>
              )}
              <SpotlightCard
                className={`h-full p-6 sm:p-7 ${
                  plan.highlight ? "border-primary shadow-soft" : "border-border"
                }`}
              >
                <div className="flex h-full min-w-0 flex-col">
                  <h3 id={`plano-${plan.id}`} className="font-display text-xl font-bold tracking-tight">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.forWho}</p>
                  <p className="mt-6 flex flex-wrap items-baseline gap-x-1">
                    <span className="font-display text-4xl font-extrabold tracking-tight">{formatBRL(plan.setup)}</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Taxa única{plan.installments ? ` ou ${plan.installments.count}x de ${formatBRL(plan.installments.amount)}` : ""}</p>
                  {plan.id === "vitrine" && plan.salesCommissionPercent === 0 && (
                    <p className="mt-4 flex gap-2 text-sm font-medium leading-relaxed text-whatsapp">
                      <Lightbulb aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      <span>Menos de R$ 0,42 por dia no primeiro ano • Sem taxas sobre suas vendas.</span>
                    </p>
                  )}
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.highlight ? "default" : "outline"}
                    className={`group/btn mt-8 h-auto min-h-12 w-full whitespace-normal rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none ${
                      plan.highlight ? "shadow-coral" : "hover:border-primary/60"
                    }`}
                  >
                    <a
                      href={getPlanWhatsappUrl(plan)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle aria-hidden="true" className="size-4 transition-transform duration-200 group-hover/btn:-rotate-6 group-hover/btn:scale-110" />
                      Quero o plano {plan.name}
                    </a>
                  </Button>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 text-center text-sm leading-relaxed text-muted-foreground">
            <Server aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-whatsapp" />
            <span>Hospedagem inclusa. Suporte e alterações sob demanda ou mensalidades opcionais a partir de R$ {OPTIONAL_SUPPORT_MONTHLY}/mês.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
