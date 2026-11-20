import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Clock, Wallet } from "lucide-react";
import { Reveal, useReveal } from "../hooks/use-reveal";
import { SpotlightCard } from "./spotlight-card";
import { SquiggleText } from "./squiggle-text";

/* ---------- Contador animado ---------- */

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function Counter({
  to,
  active,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  to: number;
  active: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const v = useCountUp(to, active);
  return (
    <span className="tabular-nums">
      {prefix}
      {v.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ---------- Linha de gráfico ---------- */

function Row({
  label,
  value,
  children,
  active,
  from = "left",
  delay = 0,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  children: ReactNode;
  /** Quando true, a linha desliza para o lugar (número + barra juntos). */
  active: boolean;
  from?: "left" | "right";
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="kq-slide"
      data-active={active}
      style={
        {
          "--kq-sx": from === "left" ? "-32px" : "32px",
          transitionDelay: `${delay}ms`,
        } as CSSProperties
      }
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-[#0B132B]/70">{label}</span>
        <span
          className={`text-xl font-extrabold sm:text-2xl ${
            highlight ? "text-[#FF5A3D]" : "text-[#0B132B]"
          }`}
        >
          {value}
        </span>
      </div>
      <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-[#0B132B]/10">
        {children}
      </div>
    </div>
  );
}

function Fill({
  percent,
  active,
  color,
  from = "left",
  delay = 0,
}: {
  percent: number;
  active: boolean;
  color: string;
  from?: "left" | "right";
  delay?: number;
}) {
  return (
    <div
      className="absolute top-0 h-full rounded-full transition-[width] duration-[1400ms] ease-out"
      style={{
        [from]: 0,
        width: active ? `${percent}%` : "0%",
        background: color,
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

/* ---------- Gráfico 1: tempo ---------- */

function TimeChart() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.35 });
  // 3,5 h = 210 min  →  25 min ≈ 11,9% da barra
  const afterPercent = (25 / 210) * 100;

  return (
    <SpotlightCard className="h-full p-6 sm:p-8">
      <div ref={ref}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF5A3D]/10 text-[#FF5A3D]">
            <Clock className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-lg font-extrabold text-[#0B132B] sm:text-xl">
            Tempo gasto no atendimento
          </h3>
        </div>

        <div className="space-y-6">
          <Row
            label="Mandando fotos soltas"
            active={visible}
            from="left"
            value={<Counter to={3.5} decimals={1} active={visible} suffix="h/dia" />}
          >
            <Fill percent={100} active={visible} color="#0B132B" />
          </Row>

          <Row
            highlight
            label="Pedidos prontos no WhatsApp"
            active={visible}
            from="right"
            delay={200}
            value={<Counter to={25} active={visible} suffix=" min/dia" />}
          >
            <Fill percent={afterPercent} active={visible} color="#FF5A3D" delay={250} />
          </Row>
        </div>

        <p className="mt-6 text-sm text-[#0B132B]/60">
          Cerca de 3 horas devolvidas ao seu dia para produzir, vender e descansar.
        </p>
      </div>
    </SpotlightCard>
  );
}

/* ---------- Gráfico 2: margem ---------- */

function MarginChart() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.35 });

  return (
    <SpotlightCard className="h-full p-6 sm:p-8">
      <div ref={ref}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF5A3D]/10 text-[#FF5A3D]">
            <Wallet className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-lg font-extrabold text-[#0B132B] sm:text-xl">
            Margem de lucro retida
          </h3>
        </div>

        <div className="space-y-6">
          <Row
            highlight
            label="Com a Klique (0% de comissão)"
            active={visible}
            from="left"
            value={<Counter to={100} active={visible} suffix="% seu" />}
          >
            <Fill percent={100} active={visible} color="#FF5A3D" />
          </Row>

          <Row
            label="Apps de terceiros"
            active={visible}
            from="right"
            delay={200}
            value={<Counter to={27} active={visible} prefix="até " suffix="% de taxa" />}
          >
            {/* A taxa "morde" a barra pela direita */}
            <Fill percent={27} active={visible} color="#0B132B" from="right" delay={250} />
          </Row>
        </div>

        <p className="mt-6 text-sm text-[#0B132B]/60">
          Cada venda é sua por inteiro: sem percentual cobrado sobre os seus pedidos.
        </p>
      </div>
    </SpotlightCard>
  );
}

/* ---------- Seção ---------- */

export function ConversionCharts() {
  return (
    <section id="antes-depois" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal stagger className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0B132B] sm:text-5xl">
            Antes e depois: mais tempo e <SquiggleText>mais lucro</SquiggleText>
          </h2>
          <p className="mt-4 text-base text-[#0B132B]/70 sm:text-lg">
            Veja o que muda quando o pedido chega organizado e a venda não paga pedágio.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal from="left">
            <TimeChart />
          </Reveal>
          <Reveal from="right" delay={150}>
            <MarginChart />
          </Reveal>
        </div>

        <p className="mt-6 text-center text-xs text-[#0B132B]/50">
          Valores de referência. A taxa dos aplicativos varia conforme plataforma e plano.
        </p>
      </div>
    </section>
  );
}
