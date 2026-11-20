import { useState } from "react";
import { CupSoda, Gift, MessageCircle, Sparkles, ArrowRight, Check, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { SIMULATOR_BRANCHES, getSimulatorBranch, getSimulatorName, getSimulatorWhatsappUrl, type SimulatorBranch } from "@/lib/vitrine-simulator";
import type { HeroSegmentId } from "@/lib/hero-segments";

/* ---------- Dados da demonstração ---------- */

const BRAND_COLORS = [
  { id: "coral", label: "Coral", hex: "#FF5A3D" },
  { id: "azul", label: "Azul", hex: "#0284C7" },
  { id: "verde", label: "Verde", hex: "#16A34A" },
  { id: "roxo", label: "Roxo", hex: "#7C3AED" },
] as const;

type SimItem = { id: string; name: string; desc: string; cents: number };

const ITEMS_LANCHONETE: SimItem[] = [
  { id: "burger", name: "X-Burger Artesanal", desc: "Pão brioche, blend 150 g e cheddar", cents: 2690 },
  { id: "batata", name: "Batata Rústica", desc: "Porção crocante com alecrim", cents: 1450 },
  { id: "shake", name: "Milkshake de Morango", desc: "400 ml, feito na hora", cents: 1600 },
];

const ITEMS_LOJA: SimItem[] = [
  { id: "caneca", name: "Caneca Personalizada", desc: "Presente com o nome da pessoa", cents: 3490 },
  { id: "kit", name: "Kit Presente Surpresa", desc: "Caixa especial com 5 itens", cents: 5990 },
  { id: "vela", name: "Vela Aromática", desc: "Lavanda, 200 g, aroma suave", cents: 3900 },
];

const ITEMS_SERVICOS: SimItem[] = [
  { id: "sessao", name: "Sessão Avulsa", desc: "50 min, online ou presencial", cents: 9000 },
  { id: "pacote", name: "Pacote de 4 Sessões", desc: "Economize R$ 40,00 no total", cents: 32000 },
  { id: "ebook", name: "Guia Prático em PDF", desc: "Dicas para começar hoje", cents: 2990 },
];

function getItems(branch: SimulatorBranch): SimItem[] {
  return branch === "lanchonete" ? ITEMS_LANCHONETE : branch === "loja" ? ITEMS_LOJA : ITEMS_SERVICOS;
}

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Hex + alfa em hexadecimal → cor translúcida (ex.: "#FF5A3D" + "1F"). */
const tint = (hex: string, alpha = "1F") => `${hex}${alpha}`;

/* ---------- Componente ---------- */

export function VitrineSimulator({ segment }: { segment: HeroSegmentId }) {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState<SimulatorBranch>("lanchonete");
  const [brand, setBrand] = useState<string>(BRAND_COLORS[0].hex);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [previewAction, setPreviewAction] = useState(false);

  const current = getSimulatorBranch(branch);
  const storeName = getSimulatorName(name, branch);
  const Icon = branch === "lanchonete" ? CupSoda : branch === "loja" ? Gift : Sparkles;
  const items = getItems(branch);

  const count = items.reduce((sum, it) => sum + (cart[it.id] ?? 0), 0);
  const total = items.reduce((sum, it) => sum + (cart[it.id] ?? 0) * it.cents, 0);

  function selectBranch(next: SimulatorBranch) {
    setBranch(next);
    setCart({});
    setPreviewAction(false);
  }

  function addItem(id: string) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setPreviewAction(false);
  }

  function clearCart() {
    setCart({});
    setPreviewAction(false);
  }

  return (
    <Dialog onOpenChange={(open) => {
      if (open) {
        setBranch(segment === "delivery" ? "lanchonete" : segment === "lojas" ? "loja" : "servicos");
        setCart({});
        setPreviewAction(false);
      }
    }}>
      <DialogTrigger asChild>
        <Button size="lg" className="mt-7 h-auto min-h-14 w-full max-w-sm whitespace-normal rounded-full px-6 py-4 text-base font-bold shadow-coral transition-transform active:scale-95">
          <Rocket aria-hidden="true" className="size-5" /> Criar Minha Vitrine Virtual
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl p-5 sm:p-7">
        <DialogHeader className="pr-6">
          <DialogTitle className="font-display text-xl leading-snug sm:text-2xl">Teste sua Vitrine Agora</DialogTitle>
          <DialogDescription>Seu negócio no celular do cliente, a um klique de vender.</DialogDescription>
        </DialogHeader>
        <div className="grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <div>
              <label htmlFor="vitrine-name" className="mb-2 block text-sm font-semibold">Nome da Loja</label>
              <input id="vitrine-name" value={name} onChange={(event) => { setName(event.target.value); setPreviewAction(false); }} placeholder="Ex.: Cantinho da Ana" className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Ramo</legend>
              <div className="grid gap-2">
                {SIMULATOR_BRANCHES.map((option) => (
                  <Button key={option.id} type="button" variant="outline" aria-pressed={branch === option.id} onClick={() => selectBranch(option.id)} className="h-11 justify-between rounded-lg aria-pressed:border-primary aria-pressed:bg-accent">
                    {option.label}<Check aria-hidden="true" className={branch === option.id ? "text-primary" : "invisible"} />
                  </Button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-1 text-sm font-semibold">Cor da marca</legend>
              <div className="-ml-1 flex items-center">
                {BRAND_COLORS.map((color) => {
                  const selected = brand === color.hex;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`Cor ${color.label}`}
                      onClick={() => setBrand(color.hex)}
                      className="grid size-11 place-items-center rounded-full outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span
                        className="grid size-8 place-items-center rounded-full text-white transition-shadow duration-200"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: selected ? `0 0 0 2px var(--background), 0 0 0 4px ${color.hex}` : undefined,
                        }}
                      >
                        <Check aria-hidden="true" className={selected ? "size-4" : "hidden"} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase text-muted-foreground">Prévia simulada</p>
            <div className="mx-auto w-full max-w-64 overflow-hidden rounded-[2rem] border-[6px] border-foreground bg-card shadow-soft">
              <div className="flex h-7 justify-center bg-card pt-2"><span className="h-2 w-16 rounded-full bg-foreground" /></div>

              {/* Cabeçalho da loja */}
              <div className="px-4 pb-4 pt-2 text-center transition-colors duration-300" style={{ backgroundColor: tint(brand) }}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp/10 px-2.5 py-1 text-[10px] font-semibold leading-tight text-whatsapp">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-whatsapp animate-pulse motion-reduce:animate-none" />
                  Aberto agora • Pedido via WhatsApp
                </span>
                <span className="mx-auto mt-3 grid size-10 place-items-center rounded-full text-white transition-colors duration-300" style={{ backgroundColor: brand }}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 aria-live="polite" className="mt-2 break-words text-lg font-bold [overflow-wrap:anywhere]">{storeName}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{current.label}</p>
              </div>

              {/* Itens */}
              <ul className="divide-y divide-border px-3">
                {items.map((item) => {
                  const qty = cart[item.id] ?? 0;
                  return (
                    <li key={item.id} className="flex items-center gap-2.5 py-2.5">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-lg transition-colors duration-300"
                        style={{ backgroundColor: tint(brand, "1A"), color: brand }}
                      >
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold leading-snug">{item.name}</p>
                        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{item.desc}</p>
                        <p className="mt-0.5 text-xs font-bold tabular-nums">{brl(item.cents)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(item.id)}
                        aria-label={`Adicionar ${item.name} ao pedido${qty ? ` (${qty} no pedido)` : ""}`}
                        className="relative grid size-9 shrink-0 place-items-center rounded-full text-white transition-[transform,background-color] duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
                        style={{ backgroundColor: brand }}
                      >
                        <Plus aria-hidden="true" className="size-4" />
                        {qty > 0 && (
                          <span
                            key={qty}
                            aria-hidden="true"
                            className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-foreground px-1 text-[10px] font-bold leading-4 text-background animate-in zoom-in-50 duration-200 motion-reduce:animate-none"
                          >
                            {qty}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Barra inferior: total do carrinho + ação */}
              <div className="flex items-center justify-between gap-2 border-t border-border bg-card p-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    {count === 0 ? "Seu pedido" : `${count} ${count === 1 ? "item" : "itens"}`}
                    {count > 0 && (
                      <button type="button" onClick={clearCart} className="font-semibold underline underline-offset-2 hover:text-foreground">
                        Limpar
                      </button>
                    )}
                  </p>
                  <p key={total} aria-live="polite" className="text-sm font-extrabold tabular-nums animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none">
                    {brl(total)}
                  </p>
                </div>
                <Button
                  type="button"
                  disabled={count === 0}
                  onClick={() => setPreviewAction(true)}
                  className="h-auto min-h-10 shrink-0 whitespace-normal rounded-full px-3 text-xs text-white transition-[transform,background-color] duration-300 hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: brand }}
                >
                  <MessageCircle aria-hidden="true" />{current.action}
                </Button>
              </div>
              <p role="status" className="min-h-8 px-3 pb-3 text-center text-xs text-muted-foreground">
                {previewAction
                  ? `Pedido de exemplo de ${brl(total)} para ${storeName} pronto!`
                  : count === 0
                    ? "Toque no + para montar um pedido"
                    : "Demonstração • Klique"}
              </p>
            </div>
          </div>
        </div>
        <Button asChild variant="whatsapp" className="h-auto min-h-14 w-full whitespace-normal rounded-full px-4 py-3 font-semibold transition-transform active:scale-95">
          <a href={getSimulatorWhatsappUrl(name, branch)} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Gostei! Quero publicar minha vitrine no WhatsApp<ArrowRight aria-hidden="true" /></a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
