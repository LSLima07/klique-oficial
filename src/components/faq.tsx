import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "../hooks/use-reveal.tsx";

export const faqs = [
  {
    question: "Preciso pagar mensalidade para manter minha vitrine no ar?",
    answer:
      "Não! Você paga apenas uma taxa única para criarmos e publicarmos sua vitrine. A hospedagem já está inclusa e o link é seu para sempre, sem comissões sobre suas vendas.",
  },
  {
    question: "Em quanto tempo meu site fica pronto?",
    answer:
      "Após você nos enviar as fotos, nomes e preços dos seus produtos pelo WhatsApp, entregamos sua vitrine pronta e testada em até 5 dias úteis.",
  },
  {
    question: "Como recebo os pedidos dos meus clientes?",
    answer:
      "O cliente escolhe os produtos na sua vitrine, preenche nome, endereço (ou retirada) e forma de pagamento, e o pedido chega mastigado e organizado direto no seu WhatsApp.",
  },
  {
    question: "Consigo atualizar preços ou marcar produtos como esgotados depois?",
    answer:
      "Sim! Podemos incluir um painel simples com senha onde você mesmo altera preços, adiciona fotos novas ou marca itens como esgotados pelo celular em segundos.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5A3D]/10 text-[#FF5A3D] mb-3">
              Dúvidas Frequentes
            </span>
            <h2 className="text-3xl font-bold text-[#0B132B]">
              Tudo o que você precisa saber
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={idx} delay={idx * 80}>
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-[#F9FAFB]/60 transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#0B132B] hover:bg-slate-100/50 transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#FF5A3D] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
