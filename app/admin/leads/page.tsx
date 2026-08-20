import { prisma } from "@/lib/prisma";
import { getAdminActiveTenant } from "@/lib/admin-tenant";
import { updateLeadStatusAction } from "@/app/actions/admin-actions";
import { buildWhatsAppLink, formatPhone } from "@/lib/utils";
import { LeadStatus } from "@prisma/client";
import { MessageCircle, Mail, Clock, CheckCircle, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const activeTenant = await getAdminActiveTenant();

  if (!activeTenant) return <div>Empresa não encontrada.</div>;

  const tenant = await prisma.tenant.findUnique({
    where: { id: activeTenant.id },
    include: {
      leads: {
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!tenant) return <div>Empresa não encontrada.</div>;

  async function handleStatusChange(formData: FormData) {
    "use server";
    const leadId = formData.get("lead_id") as string;
    const status = formData.get("status") as LeadStatus;
    await updateLeadStatusAction(leadId, status);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Gerenciador de Oportunidades & Leads
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Controle o pipeline de atendimento dos orçamentos recebidos pelo site.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {tenant.leads.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            Nenhuma mensagem recebida ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Cliente / Contato</th>
                  <th className="px-6 py-4">Interesse & Mensagem</th>
                  <th className="px-6 py-4">Data de Envio</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenant.leads.map((lead) => {
                  const whatsappUrl = buildWhatsAppLink(
                    lead.phone,
                    `Olá ${lead.name}! Sou da ${tenant.name}. Recebemos sua solicitação de orçamento sobre "${lead.service_interest || "nossos serviços"}". Como podemos ajudar?`
                  );

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} />
                          <span>{lead.email}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <MessageCircle size={12} className="text-emerald-600" />
                          <span>{formatPhone(lead.phone)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-xs text-slate-800">
                          {lead.service_interest || "Interesse Geral"}
                        </div>
                        {lead.message && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic bg-slate-50 p-2 rounded border border-slate-100">
                            &ldquo;{lead.message}&rdquo;
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{new Date(lead.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(lead.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <form action={handleStatusChange} className="inline-block">
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <select
                            name="status"
                            defaultValue={lead.status}
                            onChange={(e) => {
                              const form = e.currentTarget.form;
                              if (form) form.requestSubmit();
                            }}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${
                              lead.status === "NEW"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : lead.status === "CONTACTED"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : lead.status === "CONVERTED"
                                ? "bg-purple-50 text-purple-800 border-purple-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            <option value="NEW">🟢 Novo</option>
                            <option value="CONTACTED">🔵 Em Contato</option>
                            <option value="CONVERTED">🟣 Convertido</option>
                            <option value="ARCHIVED">⚪ Arquivado</option>
                          </select>
                        </form>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                          <MessageCircle size={14} />
                          <span>Chamar no WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
