import { prisma } from "@/lib/prisma";
import { updateSectionTogglesAction, updateThemeAction } from "@/app/actions/admin-actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Sliders, Palette, CheckCircle2 } from "lucide-react";

export default async function AdminSettingsPage() {
  const tenant = await prisma.tenant.findFirst({
    include: {
      settings: true,
      theme: true,
    },
  });

  if (!tenant) return <div>Tenant não encontrado.</div>;

  const { settings, theme } = tenant;

  async function handleToggleSubmit(formData: FormData) {
    "use server";
    await updateSectionTogglesAction(tenant!.id, {
      show_hero: formData.get("show_hero") === "on",
      show_about: formData.get("show_about") === "on",
      show_mission: formData.get("show_mission") === "on",
      show_services: formData.get("show_services") === "on",
      show_badges: formData.get("show_badges") === "on",
      show_faq: formData.get("show_faq") === "on",
      show_testimonials: formData.get("show_testimonials") === "on",
      show_contact_form: formData.get("show_contact_form") === "on",
      show_map: formData.get("show_map") === "on",
      show_footer: formData.get("show_footer") === "on",
    });
  }

  async function handleThemeSubmit(formData: FormData) {
    "use server";
    await updateThemeAction(tenant!.id, {
      primary_color: formData.get("primary_color") as string,
      secondary_color: formData.get("secondary_color") as string,
      font_family: formData.get("font_family") as string,
      logo_url: (formData.get("logo_url") as string) || undefined,
      favicon_url: (formData.get("favicon_url") as string) || undefined,
    });
  }

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
          Ative ou desative módulos da página pública e personalize cores e tipografia.
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

        <form action={handleToggleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionsList.map((sec) => (
              <label
                key={sec.key}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  name={sec.key}
                  defaultChecked={sec.default}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">{sec.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{sec.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow hover:bg-slate-800 transition-colors"
            >
              <CheckCircle2 size={16} />
              <span>Salvar Visibilidade das Seções</span>
            </button>
          </div>
        </form>
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

        <form action={handleThemeSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="primary_color" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Cor Primária (Hexadecimal)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primary_color"
                  name="primary_color"
                  defaultValue={theme?.primary_color || "#0B192C"}
                  className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer p-1"
                />
                <input
                  type="text"
                  defaultValue={theme?.primary_color || "#0B192C"}
                  className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="secondary_color" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Cor Secundária / Destaque (Hexadecimal)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="secondary_color"
                  name="secondary_color"
                  defaultValue={theme?.secondary_color || "#FF6500"}
                  className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer p-1"
                />
                <input
                  type="text"
                  defaultValue={theme?.secondary_color || "#FF6500"}
                  className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="font_family" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Família Tipográfica
              </label>
              <select
                id="font_family"
                name="font_family"
                defaultValue={theme?.font_family || "Inter"}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white"
              >
                <option value="Inter">Inter (Padrão Corporativo Moderno)</option>
                <option value="Roboto">Roboto</option>
                <option value="Outfit">Outfit</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              <ImageUpload
                name="logo_url"
                label="Logomarca da Empresa (Header & Footer)"
                defaultValue={theme?.logo_url || "/logo-dall.svg"}
                maxWidth={600}
                maxHeight={200}
                quality={0.88}
                helperText="Upload direto com compactação WebP ou link SVG/PNG."
              />

              <ImageUpload
                name="favicon_url"
                label="Ícone do Navegador (Favicon)"
                defaultValue={theme?.favicon_url || "/favicon.ico"}
                maxWidth={128}
                maxHeight={128}
                quality={0.85}
                helperText="Ícone exibido na aba do navegador (128x128)."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow hover:bg-slate-800 transition-colors"
            >
              <CheckCircle2 size={16} />
              <span>Salvar Identidade Visual</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
