import { TenantWithRelations } from "@/lib/tenant";
import { Compass, Eye, ShieldAlert, Check } from "lucide-react";

interface MissionSectionProps {
  tenant: TenantWithRelations;
}

export function MissionSection({ tenant }: MissionSectionProps) {
  const { content } = tenant;

  if (!content || (!content.mission_text && !content.vision_text && (!content.values || content.values.length === 0))) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative border-t border-slate-200/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-tenant-secondary">
            Princípios & Diretrizes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            Missão, Visão e Nossos Valores
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            O compromisso técnico e ético que orienta cada projeto e entrega da nossa empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Missão */}
          {content.mission_text && (
            <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-sm">
                <Compass size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Missão</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content.mission_text}
              </p>
            </div>
          )}

          {/* Visão */}
          {content.vision_text && (
            <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-tenant-secondary text-white flex items-center justify-center mb-6 shadow-sm">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Visão</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content.vision_text}
              </p>
            </div>
          )}

          {/* Valores */}
          {content.values && content.values.length > 0 && (
            <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-sm">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Valores</h3>
              <ul className="space-y-2.5">
                {content.values.map((val, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="p-0.5 rounded bg-emerald-50 text-emerald-600 mt-0.5 flex-shrink-0">
                      <Check size={14} />
                    </span>
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
