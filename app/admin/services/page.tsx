import { prisma } from "@/lib/prisma";
import { createServiceAction, deleteServiceAction } from "@/app/actions/admin-actions";
import { DynamicIcon } from "@/components/public/DynamicIcon";
import { Plus, Trash2, Layers, CheckCircle2 } from "lucide-react";

export default async function AdminServicesPage() {
  const tenant = await prisma.tenant.findFirst({
    include: {
      categories: {
        include: {
          services: true,
        },
      },
      services: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!tenant) return <div>Tenant não encontrado.</div>;

  async function handleCreateService(formData: FormData) {
    "use server";
    await createServiceAction(tenant!.id, formData);
  }

  async function handleDeleteService(formData: FormData) {
    "use server";
    const serviceId = formData.get("service_id") as string;
    await deleteServiceAction(serviceId);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Catálogo de Serviços & Especialidades
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Cadastre, organize e remova os serviços exibidos na grade pública.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form to Add New Service */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus size={18} className="text-tenant-secondary" />
            <h3 className="text-base font-bold text-slate-900">
              Novo Serviço
            </h3>
          </div>

          <form action={handleCreateService} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nome do Serviço *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="Ex: Projetos Elétricos Industriais"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Categoria
              </label>
              <select
                id="category_id"
                name="category_id"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white"
              >
                <option value="">Sem categoria (Geral)</option>
                {tenant.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="icon_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ícone Lucide
              </label>
              <select
                id="icon_name"
                name="icon_name"
                defaultValue="Zap"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white"
              >
                <option value="Zap">Zap (Energia / Elétrica)</option>
                <option value="Cpu">Cpu (Painéis / Automação)</option>
                <option value="Home">Home (Residencial / Smart Home)</option>
                <option value="Activity">Activity (Industrial / Monitoramento)</option>
                <option value="FileSpreadsheet">FileSpreadsheet (Laudos / SPDA)</option>
                <option value="ShieldCheck">ShieldCheck (Normas / NR10)</option>
                <option value="Wrench">Wrench (Manutenção)</option>
                <option value="Lightbulb">Lightbulb (Eficiência Energética)</option>
              </select>
            </div>

            <div>
              <label htmlFor="short_description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Descrição Curta (Card Principal) *
              </label>
              <textarea
                id="short_description"
                name="short_description"
                rows={2}
                required
                placeholder="Resumo em 1-2 frases para visualização rápida no card..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="full_description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Descrição Completa / Normas Aplicadas
              </label>
              <textarea
                id="full_description"
                name="full_description"
                rows={3}
                placeholder="Detalhes técnicos, conformidade NBR 5410, diagramas inclusos..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer pt-1">
              <input type="checkbox" name="is_featured" className="h-4 w-4 rounded border-slate-300 text-slate-900" />
              <span>Marcar como Serviço em Destaque</span>
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow hover:bg-slate-800 transition-colors"
            >
              <CheckCircle2 size={16} />
              <span>Cadastrar Serviço</span>
            </button>
          </form>
        </div>

        {/* Existing Services List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-slate-500" />
              <span>Serviços Cadastrados ({tenant.services.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {tenant.services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                    <DynamicIcon name={service.icon_name} size={20} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {service.title}
                      </h4>
                      {service.is_featured && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Destaque
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {service.short_description}
                    </p>

                    {service.category && (
                      <span className="inline-block text-[11px] font-medium text-slate-400">
                        Categoria: {service.category.name}
                      </span>
                    )}
                  </div>
                </div>

                <form action={handleDeleteService}>
                  <input type="hidden" name="service_id" value={service.id} />
                  <button
                    type="submit"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir serviço"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
