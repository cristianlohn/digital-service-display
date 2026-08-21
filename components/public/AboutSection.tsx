import Image from "next/image";
import { TenantWithRelations } from "@/lib/tenant";
import { Award, Clock, Users, CheckCircle } from "lucide-react";

interface AboutSectionProps {
  tenant: TenantWithRelations;
}

export function AboutSection({ tenant }: AboutSectionProps) {
  const { content } = tenant;

  if (!content) return null;

  const currentYear = new Date().getFullYear();
  const yearsActive = content.founded_year ? currentYear - content.founded_year : 0;
  const showExperiencePill = content.founded_year && yearsActive >= 1;

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-slate-50/70 backdrop-blur-md relative border-t border-slate-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Floating Stats */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 aspect-[4/3] sm:aspect-[4/5] bg-slate-100">
              {content.about_image_url ? (
                <Image
                  src={content.about_image_url}
                  alt={content.about_title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <span>Sobre a {tenant.name}</span>
                </div>
              )}
            </div>

            {/* Experience Pill - Exibido apenas se a empresa tiver 1 ano ou mais */}
            {showExperiencePill && (
              <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:-right-8 rounded-xl bg-slate-900 text-white p-6 shadow-2xl border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-tenant-secondary/20 text-tenant-secondary">
                  <Clock size={28} />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight text-white">
                    +{yearsActive} {yearsActive === 1 ? "Ano" : "Anos"}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    De experiência e inovação
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            {content.about_badge_text && (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Award size={14} className="text-tenant-secondary" />
                <span>{content.about_badge_text}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {content.about_title}
            </h2>

            <div className="text-base sm:text-lg text-slate-600 space-y-4 leading-relaxed font-normal">
              {content.about_description.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="p-2 rounded-lg bg-white text-emerald-600 shadow-sm">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Projetos Sob Medida
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Soluções pensadas exatamente para a sua demanda operacional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="p-2 rounded-lg bg-white text-tenant-secondary shadow-sm">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Equipe Qualificada
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Profissionais certificados e atualizados com as normas técnicas.
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
