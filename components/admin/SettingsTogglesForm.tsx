"use client";

import { useState } from "react";
import { updateSectionTogglesAction } from "@/app/actions/admin-actions";
import { SubmitButton } from "./SubmitButton";
import { FeedbackToast } from "./FeedbackToast";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface SettingsTogglesFormProps {
  tenantId: string;
  settings: {
    show_hero: boolean;
    show_about: boolean;
    show_mission: boolean;
    show_services: boolean;
    show_badges: boolean;
    show_faq: boolean;
    show_testimonials: boolean;
    show_contact_form: boolean;
    show_map: boolean;
    show_footer: boolean;
  };
  sectionsList: Array<{
    key: string;
    label: string;
    desc: string;
    default?: boolean;
  }>;
}

export function SettingsTogglesForm({
  tenantId,
  settings,
  sectionsList,
}: SettingsTogglesFormProps) {
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });

  async function handleSubmit(formData: FormData) {
    setFeedback({ status: null, message: null });

    const result = await updateSectionTogglesAction(tenantId, {
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

    if (result.success) {
      setFeedback({
        status: "success",
        message: "Visibilidade das seções atualizada com sucesso no site!",
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

      <form action={handleSubmit} className="space-y-6">
        {/* Inline Feedback Banner */}
        {feedback.status === "success" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              Ativo
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionsList.map((sec) => (
            <label
              key={sec.key}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer select-none"
            >
              <input
                type="checkbox"
                name={sec.key}
                defaultChecked={sec.default}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-slate-900 block">
                  {sec.label}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {sec.desc}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Desative seções para ocultá-las instantaneamente da landing page.
          </div>
          <SubmitButton
            label="Salvar Visibilidade das Seções"
            loadingLabel="Salvando Seções..."
            icon={<CheckCircle2 size={16} />}
          />
        </div>
      </form>
    </>
  );
}
