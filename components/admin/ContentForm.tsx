"use client";

import { useState } from "react";
import { updateContentAction } from "@/app/actions/admin-actions";
import { ImageUpload } from "./ImageUpload";
import { SubmitButton } from "./SubmitButton";
import { FeedbackToast } from "./FeedbackToast";
import { FileText, Phone, MapPin, CheckCircle2, Share2, Sparkles, HelpCircle } from "lucide-react";

interface ContentFormProps {
  tenantId: string;
  content: {
    hero_title: string;
    hero_subtitle: string;
    cta_primary_text: string;
    cta_whatsapp_text: string;
    hero_image_url?: string | null;
    about_badge_text?: string | null;
    about_title: string;
    about_description: string;
    founded_year?: number | null;
    about_image_url?: string | null;
    mission_text?: string | null;
    vision_text?: string | null;
    values: string[];
    phone?: string | null;
    whatsapp_number: string;
    email: string;
    cnpj: string;
    professional_register?: string | null;
    working_hours?: string | null;
    address_street: string;
    address_number: string;
    address_neighborhood: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    instagram_url?: string | null;
    linkedin_url?: string | null;
    facebook_url?: string | null;
    youtube_url?: string | null;
  } | null;
}

export function ContentForm({ tenantId, content }: ContentFormProps) {
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });

  async function handleSubmit(formData: FormData) {
    setFeedback({ status: null, message: null });

    const result = await updateContentAction(tenantId, formData);

    if (result.success) {
      setFeedback({
        status: "success",
        message: "Todo o conteúdo da página foi salvo e já está ativo no site!",
      });
    } else {
      setFeedback({
        status: "error",
        message: result.message || "Erro ao salvar alterações.",
      });
    }
  }

  return (
    <>
      <FeedbackToast
        status={feedback.status}
        message={feedback.message}
        onClose={() => setFeedback({ status: null, message: null })}
      />

      <form action={handleSubmit} className="space-y-8">
        {/* Inline Feedback Banner */}
        {feedback.status === "success" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles size={12} />
              <span>Atualizado</span>
            </span>
          </div>
        )}

        {/* 1. Hero Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText size={18} className="text-tenant-secondary" />
            <span>1. Seção Principal (Hero / Capa)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="hero_title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Título Principal de Impacto *
              </label>
              <input
                type="text"
                id="hero_title"
                name="hero_title"
                defaultValue={content?.hero_title}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="hero_subtitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subtítulo / Descrição Rápida *
              </label>
              <textarea
                id="hero_subtitle"
                name="hero_subtitle"
                rows={2}
                defaultValue={content?.hero_subtitle}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="cta_primary_text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Texto Botão 1 (Orçamento)
                </label>
                <input
                  type="text"
                  id="cta_primary_text"
                  name="cta_primary_text"
                  defaultValue={content?.cta_primary_text || "Solicitar Orçamento"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="cta_whatsapp_text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Texto Botão WhatsApp
                </label>
                <input
                  type="text"
                  id="cta_whatsapp_text"
                  name="cta_whatsapp_text"
                  defaultValue={content?.cta_whatsapp_text || "Falar no WhatsApp"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <ImageUpload
                name="hero_image_url"
                label="Imagem Principal da Capa (Hero)"
                defaultValue={content?.hero_image_url || ""}
                maxWidth={1400}
                maxHeight={900}
                quality={0.82}
                helperText="Imagem em alta definição com conversão automática para WebP."
              />
            </div>
          </div>
        </div>

        {/* 2. About Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText size={18} className="text-tenant-secondary" />
            <span>2. Seção Sobre a Empresa</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="about_badge_text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Badge / Tag Superior
              </label>
              <input
                type="text"
                id="about_badge_text"
                name="about_badge_text"
                defaultValue={content?.about_badge_text || "Quem Somos"}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="founded_year" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ano de Fundação
              </label>
              <input
                type="number"
                id="founded_year"
                name="founded_year"
                defaultValue={content?.founded_year || 2024}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="about_title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Título da Seção Sobre *
              </label>
              <input
                type="text"
                id="about_title"
                name="about_title"
                defaultValue={content?.about_title}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="about_description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Texto Completo da História e Diferenciais *
              </label>
              <textarea
                id="about_description"
                name="about_description"
                rows={4}
                defaultValue={content?.about_description}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <ImageUpload
                name="about_image_url"
                label="Imagem Institucional (Sobre a Empresa)"
                defaultValue={content?.about_image_url || ""}
                maxWidth={1000}
                maxHeight={1000}
                quality={0.82}
                helperText="Foto da equipe, sede ou projeto com compactação WebP."
              />
            </div>
          </div>
        </div>

        {/* 3. Mission, Vision, Values */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText size={18} className="text-tenant-secondary" />
            <span>3. Missão, Visão e Valores</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="mission_text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Missão
              </label>
              <textarea
                id="mission_text"
                name="mission_text"
                rows={3}
                defaultValue={content?.mission_text || ""}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="vision_text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Visão
              </label>
              <textarea
                id="vision_text"
                name="vision_text"
                rows={3}
                defaultValue={content?.vision_text || ""}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="values" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Valores (Um por linha)
              </label>
              <textarea
                id="values"
                name="values"
                rows={4}
                defaultValue={content?.values?.join("\n") || ""}
                placeholder="Exemplo:&#10;Ética e Transparência&#10;Inovação Constante&#10;Foco no Cliente"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* 4. Contact & Legal Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone size={18} className="text-tenant-secondary" />
            <span>4. Dados Cadastrais & Contato</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label htmlFor="whatsapp_number" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                WhatsApp Comercial (Apenas números com DDI/DDD) *
              </label>
              <input
                type="text"
                id="whatsapp_number"
                name="whatsapp_number"
                defaultValue={content?.whatsapp_number}
                placeholder="5547996348698"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Telefone Fixo / Adicional
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                defaultValue={content?.phone || ""}
                placeholder="(47) 3333-3333"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                E-mail Corporativo *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={content?.email}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="cnpj" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                CNPJ *
              </label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                defaultValue={content?.cnpj}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="professional_register" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registro Técnico / Especialidade
              </label>
              <input
                type="text"
                id="professional_register"
                name="professional_register"
                defaultValue={content?.professional_register || ""}
                placeholder="CREA-SC 223232-2 ou Soluções Web"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="working_hours" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Horário de Atendimento
              </label>
              <input
                type="text"
                id="working_hours"
                name="working_hours"
                defaultValue={content?.working_hours || ""}
                placeholder="Segunda a Sexta: 08h às 18h"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address_street" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Logradouro / Rua *
              </label>
              <input
                type="text"
                id="address_street"
                name="address_street"
                defaultValue={content?.address_street}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="address_number" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Número *
              </label>
              <input
                type="text"
                id="address_number"
                name="address_number"
                defaultValue={content?.address_number}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="address_neighborhood" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Bairro *
              </label>
              <input
                type="text"
                id="address_neighborhood"
                name="address_neighborhood"
                defaultValue={content?.address_neighborhood}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="address_city" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Cidade *
              </label>
              <input
                type="text"
                id="address_city"
                name="address_city"
                defaultValue={content?.address_city}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="address_state" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                UF / Estado *
              </label>
              <input
                type="text"
                id="address_state"
                name="address_state"
                defaultValue={content?.address_state}
                required
                maxLength={2}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm uppercase"
              />
            </div>

            <div>
              <label htmlFor="address_zip" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                CEP *
              </label>
              <input
                type="text"
                id="address_zip"
                name="address_zip"
                defaultValue={content?.address_zip}
                required
                placeholder="89228-000"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 5. Social Media */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Share2 size={18} className="text-tenant-secondary" />
            <span>5. Redes Sociais Oficiais</span>
          </h3>
          <p className="text-xs text-slate-500">
            Informe as URLs completas dos perfis da empresa. Os ícones serão exibidos no cabeçalho, rodapé e bloco de contato.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="instagram_url" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Instagram (URL Completa)
              </label>
              <input
                type="url"
                id="instagram_url"
                name="instagram_url"
                defaultValue={content?.instagram_url || ""}
                placeholder="https://instagram.com/suaempresa"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="linkedin_url" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                LinkedIn (URL Completa)
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                defaultValue={content?.linkedin_url || ""}
                placeholder="https://linkedin.com/company/suaempresa"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="facebook_url" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Facebook (URL Completa)
              </label>
              <input
                type="url"
                id="facebook_url"
                name="facebook_url"
                defaultValue={content?.facebook_url || ""}
                placeholder="https://facebook.com/suaempresa"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="youtube_url" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                YouTube (URL Completa)
              </label>
              <input
                type="url"
                id="youtube_url"
                name="youtube_url"
                defaultValue={content?.youtube_url || ""}
                placeholder="https://youtube.com/@suaempresa"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Todas as alterações são gravadas instantaneamente no banco de dados.
          </div>
          <SubmitButton
            label="Salvar Todas as Alterações de Conteúdo"
            loadingLabel="Salvando Conteúdo..."
            icon={<CheckCircle2 size={18} />}
            className="px-8 py-3.5 text-sm"
          />
        </div>
      </form>
    </>
  );
}
