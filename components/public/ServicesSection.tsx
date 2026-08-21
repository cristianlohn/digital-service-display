"use client";

import { useState } from "react";
import { TenantWithRelations } from "@/lib/tenant";
import { buildWhatsAppLink } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { ArrowRight, Layers, CheckCircle2 } from "lucide-react";

interface ServicesSectionProps {
  tenant: TenantWithRelations;
}

export function ServicesSection({ tenant }: ServicesSectionProps) {
  const { services, categories, content } = tenant;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!services || services.length === 0) return null;

  // Filtragem dos serviços por categoria
  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category_id === selectedCategory);

  return (
    <section id="servicos" className="py-20 sm:py-28 bg-white/70 backdrop-blur-md relative border-t border-slate-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            <Layers size={14} className="text-tenant-secondary" />
            <span>Nossas Especialidades</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Soluções de Alta Performance
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
            Atuamos em todas as etapas do seu projeto com conformidade normativa, tecnologia de ponta e garantia de qualidade.
          </p>

          {/* Category Tabs */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === "all"
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos os Serviços ({services.length})
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    selectedCategory === category.id
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category.name} ({category.services?.length || 0})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => {
            const whatsappMsg = content
              ? buildWhatsAppLink(
                  content.whatsapp_number,
                  `Olá! Gostaria de um orçamento para o serviço: "${service.title}".`
                )
              : "#";

            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-7 shadow-sm border border-slate-200/80 hover:border-slate-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* Service Icon and Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                      <DynamicIcon name={service.icon_name} size={28} />
                    </div>

                    {service.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                        <CheckCircle2 size={12} />
                        Destaque
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-tenant-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {service.short_description}
                  </p>

                  {service.full_description && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6 leading-relaxed">
                      {service.full_description}
                    </p>
                  )}
                </div>

                {/* Card Action: WhatsApp Direct Request */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={whatsappMsg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e9e4f] hover:text-[#187f40] transition-colors"
                  >
                    <WhatsAppIcon size={14} fillColor="#1e9e4f" />
                    <span>Pedir Orçamento</span>
                  </a>

                  <a
                    href="#contato"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <span>Detalhes</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
