import Link from "next/link";
import { ArrowRight, Shield, Layers, LayoutDashboard, Globe } from "lucide-react";

export default function PlatformHomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
            <Shield size={22} className="text-amber-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Digital Service Display
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            <LayoutDashboard size={16} />
            <span>Acessar Painel /admin</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 flex flex-col items-center text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-slate-300 border border-slate-800 mb-6">
          <Globe size={14} className="text-emerald-400" />
          <span>Plataforma White-Label Multitenant Ativa</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Ambiente White-Label de Exibição de Serviços
        </h1>

        <p className="text-base sm:text-xl text-slate-400 mt-6 leading-relaxed max-w-2xl">
          Arquitetura modular em Next.js com suporte a múltiplos domínios, isolamento de dados no PostgreSQL/Supabase e SEO técnico estruturado com Schema.org.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link
            href="/dall-automacao"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl transition-all"
          >
            <span>Ver Demonstração: D&apos;All Engenharia</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-8 py-4 text-sm font-bold text-white transition-all"
          >
            <Layers size={18} />
            <span>Gerenciar no Painel Administrativo</span>
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-900 px-8 py-6 text-center text-xs text-slate-600">
        Digital Service Display &bull; Next.js App Router &bull; Prisma &bull; Supabase &bull; Vercel Serverless
      </footer>
    </div>
  );
}
