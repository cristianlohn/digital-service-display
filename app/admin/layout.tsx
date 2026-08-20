import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  LayoutDashboard,
  FileText,
  Sliders,
  Layers,
  Users,
  ExternalLink,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pega o primeiro tenant para contexto do admin (ou do usuário autenticado)
  const tenant = await prisma.tenant.findFirst({
    include: { theme: true },
  });

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
        <div className="flex min-h-screen">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800">
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
                    {tenant?.name || "Empresa Ativa"}
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

            {/* Bottom Actions: View Public Page */}
            <div className="p-4 border-t border-slate-800">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                <span>Ver Site Público</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </aside>

          {/* Main Admin Content Area */}
          <div className="flex-1 flex flex-col">
            <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Tenant:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {tenant?.slug || "dall-automacao"}
                </span>
                {tenant?.custom_domain && (
                  <span className="text-xs text-slate-400">
                    ({tenant.custom_domain})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>Modo de Produção / Vercel Edge</span>
              </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
