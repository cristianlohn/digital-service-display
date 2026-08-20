import { prisma } from "@/lib/prisma";
import { getAdminActiveTenant } from "@/lib/admin-tenant";
import Link from "next/link";
import { formatPhone } from "@/lib/utils";
import {
  Users,
  Layers,
  Sliders,
  ArrowUpRight,
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const activeTenant = await getAdminActiveTenant();

  if (!activeTenant) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Nenhum Tenant Encontrado</h2>
        <p className="text-sm text-slate-500 mt-2">
          Execute o comando de seed: <code className="bg-slate-100 p-1 rounded">npm run prisma:seed</code>
        </p>
      </div>
    );
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: activeTenant.id },
    include: {
      settings: true,
      services: true,
      categories: true,
      leads: {
        orderBy: { created_at: "desc" },
        take: 5,
      },
      _count: {
        select: {
          services: true,
          leads: true,
          categories: true,
        },
      },
    },
  });

  if (!tenant) {
    return <div>Empresa não encontrada.</div>;
  }

  const newLeadsCount = await prisma.lead.count({
    where: { tenant_id: tenant.id, status: "NEW" },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Painel de Controle: {tenant.name}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie o conteúdo, serviços, tema e leads recebidos pelo site público.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <Sliders size={15} />
            <span>Configurar Seções</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Novos Leads
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {newLeadsCount}
            </div>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">
              Aguardando contato
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total de Leads
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {tenant._count.leads}
            </div>
            <span className="text-xs text-slate-400 font-medium mt-1 inline-block">
              Histórico completo
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Serviços Ativos
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {tenant._count.services}
            </div>
            <span className="text-xs text-slate-400 font-medium mt-1 inline-block">
              Em {tenant._count.categories} categorias
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Layers size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Status do Site
            </span>
            <div className="text-xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
              <CheckCircle size={20} />
              Online
            </div>
            <span className="text-xs text-slate-400 font-medium mt-1 inline-block">
              Multitenant Ativo
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-slate-700">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Últimos Contatos Recebidos
            </h3>
            <p className="text-xs text-slate-500">
              Leads enviados através do formulário público do site
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-tenant-secondary transition-colors"
          >
            <span>Ver Todos os Leads</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {tenant.leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Nenhum lead recebido ainda. Teste o formulário na página pública!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Nome / Empresa</th>
                  <th className="px-6 py-3.5">Contato</th>
                  <th className="px-6 py-3.5">Serviço de Interesse</th>
                  <th className="px-6 py-3.5">Data</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenant.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div>{lead.email}</div>
                      <div className="text-slate-400">{formatPhone(lead.phone)}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700">
                      {lead.service_interest || "Geral / Consultoria"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          lead.status === "NEW"
                            ? "bg-emerald-100 text-emerald-800"
                            : lead.status === "CONTACTED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {lead.status === "NEW"
                          ? "Novo"
                          : lead.status === "CONTACTED"
                          ? "Em Contato"
                          : "Convertido"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
