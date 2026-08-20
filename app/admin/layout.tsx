import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";
import {
  LayoutDashboard,
  FileText,
  Sliders,
  Layers,
  Users,
  ExternalLink,
  Shield,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Se não estiver autenticado (ex: na tela /admin/login), renderiza sem sidebar
  if (!user) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  let tenant = null;

  try {
    if (user.tenantId) {
      tenant = await prisma.tenant.findUnique({
        where: { id: user.tenantId },
        include: { theme: true },
      });
    }

    if (!tenant) {
      tenant = await prisma.tenant.findFirst({
        include: { theme: true },
      });
    }
  } catch (error) {
    console.error("Erro ao buscar tenant no admin layout:", error);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased font-sans flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          {/* Brand / Tenant Info */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">
                Painel White-Label
              </h1>
              <p className="text-xs text-slate-400 truncate max-w-[140px]">
                {tenant?.name || "Plataforma SaaS"}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LayoutDashboard size={18} className="text-slate-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Sliders size={18} className="text-slate-400" />
              <span>Seções & Tema</span>
            </Link>

            <Link
              href="/admin/content"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FileText size={18} className="text-slate-400" />
              <span>Textos & Contato</span>
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Layers size={18} className="text-slate-400" />
              <span>Catálogo de Serviços</span>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Users size={18} className="text-slate-400" />
              <span>Leads & Contatos</span>
            </Link>
          </nav>
        </div>

        {/* User Profile & Logout Bottom Section */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* User Info Card */}
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user.role === "SUPER_ADMIN" ? "Super Admin" : "Gestor"} • {user.email}
              </div>
            </div>
          </div>

          <a
            href={tenant?.custom_domain ? `https://${tenant.custom_domain}` : `/${tenant?.slug || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            <span>Ver Site Público</span>
            <ExternalLink size={13} />
          </a>

          <LogoutButton />
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Empresa Ativa:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              {tenant?.name || "Catuto Soluções Digitais"}
            </span>
            {tenant?.custom_domain && (
              <span className="text-xs text-slate-400">
                ({tenant.custom_domain})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sessão Segura</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
