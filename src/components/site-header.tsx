import { Link } from "@tanstack/react-router";
import { WHATSAPP_QUOTE_URL } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import logo from "@/assets/klique-logo.png.asset.json";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/5 bg-background/85 backdrop-blur-xl">
      {/*
        Altura flexível (min-h + py) em vez de h-16 fixo: a logo (h-12 / sm:h-14) nunca
        passa do contêiner e nada é cortado, em nenhuma largura de tela.
      */}
      <div className="mx-auto grid min-h-[4.5rem] max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 sm:flex sm:justify-between sm:px-6">
        <Link
          to="/"
          aria-label="Klique — início"
          className="inline-flex min-w-0 items-center whitespace-nowrap py-1 leading-normal"
        >
          {/* block remove a folga de baseline que o <img> inline deixava embaixo */}
          <img
            src={logo.url}
            alt="Klique"
            width={1280}
            height={1197}
            className="block h-12 w-auto shrink-0 object-contain sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#orcamento"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Planos
          </a>
          <a
            href="#portfolio"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Portfólio
          </a>
          <a
            href={WHATSAPP_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contato
          </a>
        </nav>

        <Button asChild className="h-auto shrink-0 rounded-full px-4 py-2 text-xs font-semibold shadow-coral transition-transform active:scale-95 sm:text-sm">
        <a
          href={WHATSAPP_QUOTE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar com Consultor
        </a>
        </Button>
      </div>
    </header>
  );
}
