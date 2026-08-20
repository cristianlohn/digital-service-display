import Image from "next/image";
import Link from "next/link";
import { TenantWithRelations } from "@/lib/tenant";
import { buildWhatsAppLink } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroSectionProps {
  tenant: TenantWithRelations;
}

export function HeroSection({ tenant }: HeroSectionProps) {
  const { content, theme, badges } = tenant;

  if (!content) return null;

  const whatsappUrl = buildWhatsAppLink(
    content.whatsapp_number,
    `Olá! Gostaria de falar sobre os serviços de ${tenant.name}.`
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 lg:py-32">
      {/* Background geometric accents */}
      <div className="absolute inset-0 subtle-grid-bg pointer-events-none opacity-40" />
      <div
        className="absolute -top-40 right-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-tenant-primary to-tenant-secondary opacity-20 sm:left-[calc(50%+15rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Quick Authority Pill */}
            {content.professional_register && (
              <div className="inline-flex items-center justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200/80 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {content.professional_register} | {content.address_city} - {content.address_state}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {content.hero_title}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {content.hero_subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={content.cta_primary_link || "#contato"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl transition-all active:scale-95"
              >
                <span>{content.cta_primary_text || "Solicitar Orçamento"}</span>
                <ArrowRight size={18} />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-[#20bd5a] hover:shadow-xl transition-all active:scale-95"
              >
                <WhatsAppIcon size={20} fillColor="#FFFFFF" />
                <span>{content.cta_whatsapp_text || "Falar no WhatsApp"}</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            {badges && badges.length > 0 && (
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-2 text-left">
                    <div className="flex-shrink-0 p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                      <DynamicIcon name={badge.icon_name} size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {badge.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hero Visual & Authority Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 aspect-[4/3] lg:aspect-[4/4] bg-slate-100">
                {content.hero_image_url ? (
                  <Image
                    src={content.hero_image_url}
                    alt={content.hero_title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-200">
                    <span className="text-2xl font-bold">{tenant.name}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-8 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[260px]">
                <div className="p-2.5 rounded-lg bg-tenant-secondary/15 text-tenant-secondary flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    Atendimento Técnico Especializado
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Projetos com Responsabilidade Técnica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
