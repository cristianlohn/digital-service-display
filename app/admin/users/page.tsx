import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { Users, UserPlus, Shield, Building2, Key, Calendar } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/admin/login");
  }

  // Apenas Super Admin tem acesso à gestão global de usuários
  if (currentUser.role !== "SUPER_ADMIN") {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
        <div className="p-3 rounded-full bg-amber-50 text-amber-600 inline-block">
          <Shield size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Acesso Restrito</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          A criação e gerenciamento de usuários é restrita a Super Administradores da plataforma.
        </p>
      </div>
    );
  }

  const users = await prisma.adminUser.findMany({
    include: {
      tenant: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const tenants = await prisma.tenant.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Gerenciador de Usuários & Acessos
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Cadastre novos gestores para os clientes ou crie contas de Super Administrador.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form to Add New User */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserPlus size={18} className="text-tenant-secondary" />
            <h3 className="text-base font-bold text-slate-900">
              Novo Usuário / Gestor
            </h3>
          </div>

          <CreateUserForm tenants={tenants} />
        </div>

        {/* Existing Users List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-slate-500" />
              <span>Usuários Cadastrados ({users.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    user.role === "SUPER_ADMIN"
                      ? "bg-slate-900 text-emerald-400 border border-slate-700"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {user.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-slate-900 text-emerald-400 border-slate-800"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {user.role === "SUPER_ADMIN" ? "Super Admin" : "Gestor"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-mono">
                      {user.email}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 size={12} />
                        <span>{user.tenant ? user.tenant.name : "Todas as Empresas"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(user.created_at).toLocaleDateString("pt-BR")}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {currentUser.userId !== user.id && (
                  <DeleteUserButton userId={user.id} userName={user.name} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
