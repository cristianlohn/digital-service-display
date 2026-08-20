import { prisma } from "@/lib/prisma";
import { getAdminActiveTenant } from "@/lib/admin-tenant";
import { SettingsTogglesForm } from "@/components/admin/SettingsTogglesForm";
import { SettingsThemeForm } from "@/components/admin/SettingsThemeForm";
import { SettingsSeoForm } from "@/components/admin/SettingsSeoForm";
import { Sliders, Palette, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const activeTenant = await getAdminActiveTenant();

  if (!activeTenant) return <div>Empresa não encontrada.</div>;

  const tenant = await prisma.tenant.findUnique({
    where: { id: activeTenant.id },
    include: {
      settings: true,
      theme: true,
      seo_config: true,
    },
  });

  if (!tenant) return <div>Empresa não encontrada.</div>;

  const { settings, theme, seo_config } = tenant;

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

  const domainUrl = tenant.custom_domain
    ? `https://${tenant.custom_domain}`
    : `https://${tenant.slug}.digitaldisplay.com.br`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Configuração de Seções, Tema & Compartilhamento
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ative ou desative módulos da página pública, personalize cores, favicon e configure a prévia do WhatsApp.
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
              Identidade Visual & Favicon (White-Label)
            </h3>
            <p className="text-xs text-slate-500">
              Ajuste as cores principais, tipografia, logotipo, favicon do navegador e imagem panorâmica de fundo.
            </p>
          </div>
        </div>

        <SettingsThemeForm tenantId={tenant.id} theme={theme} />
      </div>

      {/* 3. SEO & WhatsApp Share Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 rounded-lg bg-[#25D366] text-white">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Cartão de Compartilhamento no WhatsApp & SEO (Google)
            </h3>
            <p className="text-xs text-slate-500">
              Personalize a imagem (1200x630), título e descrição que aparecem quando você compartilha o link no WhatsApp, Facebook ou LinkedIn.
            </p>
          </div>
        </div>

        <SettingsSeoForm
          tenantId={tenant.id}
          tenantName={tenant.name}
          domainUrl={domainUrl}
          seoConfig={seo_config}
        />
      </div>
    </div>
  );
}
