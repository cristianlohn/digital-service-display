import { TenantWithRelations } from "@/lib/tenant";
import { formatCNPJ } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { ShieldCheck, Award, FileText, CheckCircle2 } from "lucide-react";

interface CredentialsBarProps {
  tenant: TenantWithRelations;
}

export function CredentialsBar({ tenant }: CredentialsBarProps) {
  const { content, badges } = tenant;

  return (
    <section
      id="diferenciais"
      className="border-y border-slate-200 bg-slate-900 text-slate-100 py-6 sm:py-8 shadow-inner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="p-2 rounded-lg bg-white/10 text-tenant-secondary">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Credibilidade & Conformidade
              </p>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Empresa Registrada e Habilitada
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto">
            {content?.professional_register && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-800/80 px-4 py-2.5 border border-slate-700/60">
                <Award size={18} className="text-tenant-secondary flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Registro Profissional
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    {content.professional_register}
                  </span>
                </div>
              </div>
            )}

            {content?.cnpj && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-800/80 px-4 py-2.5 border border-slate-700/60">
                <FileText size={18} className="text-emerald-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    CNPJ Ativo
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    {formatCNPJ(content.cnpj)}
                  </span>
                </div>
              </div>
            )}

            {badges && badges.length > 0 && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-800/80 px-4 py-2.5 border border-slate-700/60">
                <CheckCircle2 size={18} className="text-amber-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {badges[0].label}
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    {badges[0].value}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
