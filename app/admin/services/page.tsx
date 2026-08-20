import { prisma } from "@/lib/prisma";
import { getAdminActiveTenant } from "@/lib/admin-tenant";
import { CreateServiceForm } from "@/components/admin/CreateServiceForm";
import { DeleteServiceButton } from "@/components/admin/DeleteServiceButton";
import { DynamicIcon } from "@/components/public/DynamicIcon";
import { Plus, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const activeTenant = await getAdminActiveTenant();

  if (!activeTenant) return <div>Empresa não encontrada.</div>;

  const tenant = await prisma.tenant.findUnique({
    where: { id: activeTenant.id },
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

  if (!tenant) return <div>Empresa não encontrada.</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Catálogo de Serviços & Especialidades
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Cadastre, organize e remova os serviços exibidos na grade pública em tempo real.
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

          <CreateServiceForm
            tenantId={tenant.id}
            categories={tenant.categories.map((c) => ({ id: c.id, name: c.name }))}
          />
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
            {tenant.services.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                Nenhum serviço cadastrado ainda. Use o formulário ao lado para adicionar.
              </div>
            ) : (
              tenant.services.map((service) => (
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

                  <DeleteServiceButton serviceId={service.id} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
