"use client";

import { useState } from "react";
import { updateSeoAction } from "@/app/actions/admin-actions";
import { ImageUpload } from "./ImageUpload";
import { SubmitButton } from "./SubmitButton";
import { FeedbackToast } from "./FeedbackToast";
import { Globe, CheckCircle2, Sparkles, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";

interface SettingsSeoFormProps {
  tenantId: string;
  tenantName: string;
  domainUrl: string;
  seoConfig: {
    meta_title?: string | null;
    meta_description?: string | null;
    keywords?: string[];
    og_image_url?: string | null;
  } | null;
}

export function SettingsSeoForm({
  tenantId,
  tenantName,
  domainUrl,
  seoConfig,
}: SettingsSeoFormProps) {
  const [metaTitle, setMetaTitle] = useState(
    seoConfig?.meta_title || `${tenantName} | Soluções Digitais & Serviços`
  );
  const [metaDescription, setMetaDescription] = useState(
    seoConfig?.meta_description ||
      `Conheça os serviços especializados e solicite seu orçamento com a ${tenantName}.`
  );
  const [ogImageUrl, setOgImageUrl] = useState(
    seoConfig?.og_image_url || ""
  );
  const [keywords, setKeywords] = useState(
    seoConfig?.keywords?.join(", ") || ""
  );

  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });

  async function handleSubmit(formData: FormData) {
    setFeedback({ status: null, message: null });

    const keywordsArray = ((formData.get("keywords") as string) || "")
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const result = await updateSeoAction(tenantId, {
      meta_title: (formData.get("meta_title") as string)?.trim(),
      meta_description: (formData.get("meta_description") as string)?.trim(),
      keywords: keywordsArray,
      og_image_url: ((formData.get("og_image_url") as string) || "").trim() || undefined,
    });

    if (result.success) {
      setFeedback({
        status: "success",
        message: "SEO e cartão de compartilhamento do WhatsApp atualizados!",
      });
    } else {
      setFeedback({
        status: "error",
        message: result.message || "Erro ao salvar SEO.",
      });
    }
  }

  const cleanDomain = domainUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <>
      <FeedbackToast
        status={feedback.status}
        message={feedback.message}
        onClose={() => setFeedback({ status: null, message: null })}
      />

      <form action={handleSubmit} className="space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Fields */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label
                htmlFor="meta_title"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Título da Página & Compartilhamento (Meta Title) *
              </label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                required
                maxLength={70}
                placeholder="Ex: Minha Empresa | Serviços em Joinville e Região"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Título exibido na aba do navegador e nos links compartilhados.</span>
                <span>{metaTitle.length}/70</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="meta_description"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Descrição de Compartilhamento (Meta Description) *
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                required
                maxLength={160}
                placeholder="Apresente sua proposta em até 160 caracteres..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Texto de resumo no Google e no balão do WhatsApp.</span>
                <span>{metaDescription.length}/160</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="keywords"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Palavras-chave (Separadas por vírgula)
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="engenharia, automação, projetos elétricos, joinville"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <ImageUpload
                name="og_image_url"
                label="Imagem do Cartão WhatsApp / Redes Sociais (Open Graph 1200x630)"
                defaultValue={ogImageUrl}
                maxWidth={1200}
                maxHeight={630}
                quality={0.85}
                helperText="Banner retangular (1200x630 px) que aparece na prévia do WhatsApp quando o link é compartilhado."
              />
            </div>
          </div>

          {/* Right: Live WhatsApp Preview Card */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <MessageSquare size={14} className="text-[#25D366]" />
              <span>Prévia no WhatsApp ao Compartilhar</span>
            </div>

            {/* Simulated WhatsApp Bubble */}
            <div className="rounded-2xl bg-[#EFEAE2] p-4 border border-slate-200 shadow-sm space-y-2">
              <div className="max-w-[320px] rounded-xl bg-[#DCF8C6] border border-[#d2eac1] p-2.5 shadow-sm space-y-2 text-slate-900 ml-auto">
                {/* Simulated Link Preview Card */}
                <div className="rounded-lg overflow-hidden bg-[#c9e8b3] border border-[#b2dc9c]">
                  {/* Image Preview */}
                  <div className="relative aspect-[1.91/1] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {ogImageUrl ? (
                      <Image
                        src={ogImageUrl}
                        alt="Prévia Open Graph"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="p-4 text-center text-white/80 space-y-1">
                        <Share2 size={24} className="mx-auto text-white/50" />
                        <span className="text-[11px] font-semibold block">
                          {tenantName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="p-3 space-y-1 bg-[#d5edc2]">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight">
                      {metaTitle || "Título da Sua Empresa"}
                    </h4>
                    <p className="text-[11px] text-slate-700 line-clamp-2 leading-snug">
                      {metaDescription || "Resumo e diferenciais da sua empresa para clientes e parceiros."}
                    </p>
                    <span className="text-[10px] text-slate-500 block truncate pt-0.5">
                      {cleanDomain}
                    </span>
                  </div>
                </div>

                {/* Simulated Link URL in message */}
                <div className="text-[11px] text-emerald-800 font-medium underline break-all">
                  https://{cleanDomain}
                </div>

                <div className="text-[9px] text-slate-500 text-right">
                  Agora • ✓✓
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              💡 Dica: O WhatsApp armazena links em cache por alguns minutos após o primeiro envio.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Alterações refletem imediatamente no Google, WhatsApp, Facebook e LinkedIn.
          </div>
          <SubmitButton
            label="Salvar Configurações de SEO & Compartilhamento"
            loadingLabel="Salvando SEO..."
            icon={<CheckCircle2 size={16} />}
            className="px-6 py-2.5"
          />
        </div>
      </form>
    </>
  );
}
