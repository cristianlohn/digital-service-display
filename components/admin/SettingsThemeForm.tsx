"use client";

import { useState } from "react";
import { updateThemeAction } from "@/app/actions/admin-actions";
import { ImageUpload } from "./ImageUpload";
import { SubmitButton } from "./SubmitButton";
import { FeedbackToast } from "./FeedbackToast";
import { CheckCircle2, Palette, Sparkles } from "lucide-react";

interface SettingsThemeFormProps {
  tenantId: string;
  theme: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    logo_url?: string | null;
    favicon_url?: string | null;
    background_image_url?: string | null;
  } | null;
}

export function SettingsThemeForm({ tenantId, theme }: SettingsThemeFormProps) {
  const [primaryColor, setPrimaryColor] = useState(theme?.primary_color || "#0B192C");
  const [secondaryColor, setSecondaryColor] = useState(theme?.secondary_color || "#FF6500");
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });

  async function handleSubmit(formData: FormData) {
    setFeedback({ status: null, message: null });

    const result = await updateThemeAction(tenantId, {
      primary_color: formData.get("primary_color") as string,
      secondary_color: formData.get("secondary_color") as string,
      font_family: formData.get("font_family") as string,
      logo_url: (formData.get("logo_url") as string) || null,
      favicon_url: (formData.get("favicon_url") as string) || null,
      background_image_url: (formData.get("background_image_url") as string) || null,
    });

    if (result.success) {
      setFeedback({
        status: "success",
        message: "Identidade visual e tema atualizados com sucesso!",
      });
    } else {
      setFeedback({
        status: "error",
        message: result.message || "Erro ao salvar tema.",
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

      <form action={handleSubmit} className="space-y-6">
        {/* Inline Feedback Banner */}
        {feedback.status === "success" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles size={12} />
              <span>Ao Vivo</span>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Cor Primária */}
          <div>
            <label htmlFor="primary_color" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Cor Primária (Hex)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="primary_color"
                name="primary_color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono uppercase"
              />
            </div>
          </div>

          {/* Cor Secundária / Destaque */}
          <div>
            <label htmlFor="secondary_color" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Cor de Destaque / Botões (Hex)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="secondary_color"
                name="secondary_color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono uppercase"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
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
              <option value="Montserrat">Montserrat (Geométrica / Forte)</option>
              <option value="Roboto">Roboto</option>
              <option value="Outfit">Outfit</option>
            </select>
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            <ImageUpload
              name="logo_url"
              label="Logomarca da Empresa (Header & Footer)"
              defaultValue={theme?.logo_url || ""}
              maxWidth={600}
              maxHeight={200}
              quality={0.88}
              helperText="Upload direto com compactação WebP ou link SVG/PNG."
            />

            <ImageUpload
              name="favicon_url"
              label="Ícone do Navegador (Favicon)"
              defaultValue={theme?.favicon_url || ""}
              maxWidth={128}
              maxHeight={128}
              quality={0.85}
              helperText="Ícone exibido na aba do navegador (128x128)."
            />
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-100">
            <ImageUpload
              name="background_image_url"
              label="Imagem de Fundo Panorâmica (Hero / Capa do Site)"
              defaultValue={theme?.background_image_url || ""}
              maxWidth={1920}
              maxHeight={1080}
              quality={0.82}
              helperText="Imagem de fundo de alta resolução (ex: fábrica, máquinas, tecnologia) com ajuste automático de contraste e compressão WebP."
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Cores aplicadas dinamicamente nas variáveis CSS do site.
          </div>
          <SubmitButton
            label="Salvar Identidade Visual"
            loadingLabel="Salvando Tema..."
            icon={<CheckCircle2 size={16} />}
          />
        </div>
      </form>
    </>
  );
}
