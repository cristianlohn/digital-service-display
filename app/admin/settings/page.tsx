import { prisma } from "@/lib/prisma";
import { SettingsTogglesForm } from "@/components/admin/SettingsTogglesForm";
import { SettingsThemeForm } from "@/components/admin/SettingsThemeForm";
import { Sliders, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const tenant = await prisma.tenant.findFirst({
    include: {
      settings: true,
      theme: true,
    },
  });

  if (!tenant) return <div>Tenant não encontrado.</div>;

  const { settings, theme } = tenant;

  const sectionsList = [
    { key: "show_hero", label: "Seção Hero (Banner Principal)", desc: "Título de impacto, slogan e botões de chamada rápida.", default: settings?.show_hero },
    { key: "show_badges", label: "Barra de Credenciais & Conformidade", desc: "Destaque de CNPJ, CREA/OAB e conformidade com normas técnicas.", default: settings?.show_badges },
    { key: "show_services", label: "Catálogo de Serviços", desc: "Grid interativo com abas de categorias e botão de orçamento.", default: settings?.show_services },
    { key: "show_about", label: "Seção Sobre a Empresa", desc: "História, anos de atuação, imagem corporativa e diferenciais.", default: settings?.show_about },
    { key: "show_mission", label: "Missão, Visão e Valores", desc: "Cartões informativos com os pilares éticos da empresa.", default: settings?.show_mission },
    { key: "show_faq", label: "Perguntas Frequentes (FAQ)", desc: "Acordeão de dúvidas técnicas comuns dos clientes.", default: settings?.show_faq },
    { key: "show_testimonials", label: "Depoimentos de Clientes", desc: "Avaliações e comentários de parceiros e contratantes.", default: settings?.show_testimonials },
    { key: "show_contact_form", label: "Formulário de Contato & Informações", desc: "Formulário de lead, endereço, telefone e horário.", default: settings?.show_contact_form },
    { key: "show_footer", label: "Rodapé Institucional", desc: "Links de navegação, dados cadastrais e copyright.", default: settings?.show_footer },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Configuração de Seções & Identidade Visual
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ative ou desative módulos da página pública e personalize cores e tipografia em tempo real.
        </p>
      </div>

      {/* 1. Section Toggles */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 rounded-lg bg-slate-900 text-white">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Módulos Visíveis na Página Pública
            </h3>
            <p className="text-xs text-slate-500">
              Desative qualquer seção instantaneamente sem alterar os dados cadastrados.
            </p>
          </div>
        </div>

        <SettingsTogglesForm
          tenantId={tenant.id}
          settings={
            settings || {
              show_hero: true,
              show_about: true,
              show_mission: true,
              show_services: true,
              show_badges: true,
              show_faq: true,
              show_testimonials: true,
              show_contact_form: true,
              show_map: false,
              show_footer: true,
            }
          }
          sectionsList={sectionsList}
        />
      </div>

      {/* 2. Theme Customizer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 rounded-lg bg-tenant-secondary text-white">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Cores e Identidade Visual (White-Label)
            </h3>
            <p className="text-xs text-slate-500">
              Ajuste as cores principais e secundárias aplicadas nos botões, fundos e ícones.
            </p>
          </div>
        </div>

        <SettingsThemeForm tenantId={tenant.id} theme={theme} />
      </div>
    </div>
  );
}
