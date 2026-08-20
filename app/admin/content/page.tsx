import { prisma } from "@/lib/prisma";
import { getAdminActiveTenant } from "@/lib/admin-tenant";
import { ContentForm } from "@/components/admin/ContentForm";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const activeTenant = await getAdminActiveTenant();

  if (!activeTenant) return <div>Empresa não encontrada.</div>;

  const tenant = await prisma.tenant.findUnique({
    where: { id: activeTenant.id },
    include: { content: true },
  });

  if (!tenant) return <div>Empresa não encontrada.</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Gerenciador de Conteúdo & Dados Institucionais
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Edite os textos do Hero, Sobre a Empresa, Missão/Valores, Redes Sociais e Informações de Contato.
        </p>
      </div>

      <ContentForm tenantId={tenant.id} content={tenant.content} />
    </div>
  );
}
