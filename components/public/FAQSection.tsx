"use client";

import { useState } from "react";
import { TenantWithRelations } from "@/lib/tenant";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQSectionProps {
  tenant: TenantWithRelations;
}

export function FAQSection({ tenant }: FAQSectionProps) {
  const { faqs } = tenant;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white/70 backdrop-blur-md border-t border-slate-200/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-200/80 px-3.5 py-1 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            <HelpCircle size={14} className="text-tenant-secondary" />
            <span>Tire suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Respostas diretas sobre contratação, prazos, emissão de ART e processos técnicos.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1 rounded-full text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-slate-900 bg-slate-100" : ""
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
