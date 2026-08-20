"use client";

import { useState, useRef } from "react";
import { createServiceAction } from "@/app/actions/admin-actions";
import { SubmitButton } from "./SubmitButton";
import { FeedbackToast } from "./FeedbackToast";
import { Plus, CheckCircle2 } from "lucide-react";

interface CreateServiceFormProps {
  tenantId: string;
  categories: Array<{ id: string; name: string }>;
}

export function CreateServiceForm({ tenantId, categories }: CreateServiceFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });

  async function handleSubmit(formData: FormData) {
    setFeedback({ status: null, message: null });

    const result = await createServiceAction(tenantId, formData);

    if (result.success) {
      setFeedback({
        status: "success",
        message: "Novo serviço cadastrado com sucesso!",
      });
      formRef.current?.reset();
    } else {
      setFeedback({
        status: "error",
        message: result.message || "Erro ao criar serviço.",
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

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        {feedback.status === "success" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-900 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Nome do Serviço *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Ex: Projetos Elétricos Industriais"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="category_id" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Categoria
          </label>
          <select
            id="category_id"
            name="category_id"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white"
          >
            <option value="">Sem categoria (Geral)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="icon_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Ícone
          </label>
          <select
            id="icon_name"
            name="icon_name"
            defaultValue="Zap"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white"
          >
            <option value="Zap">Zap (Energia / Elétrica)</option>
            <option value="Cpu">Cpu (Painéis / Automação)</option>
            <option value="ShieldCheck">ShieldCheck (Laudos / Normas)</option>
            <option value="Home">Home (Residencial / Predial)</option>
            <option value="Activity">Activity (Performance / Monitoramento)</option>
            <option value="Globe">Globe (Web / Internet)</option>
            <option value="Layout">Layout (Design / Sites)</option>
            <option value="Wrench">Wrench (Manutenção)</option>
            <option value="CheckCircle">CheckCircle (Geral)</option>
          </select>
        </div>

        <div>
          <label htmlFor="short_description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Descrição Curta (Card) *
          </label>
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            required
            placeholder="Resumo exibido no cartão do serviço..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="full_description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Descrição Detalhada (Opcional)
          </label>
          <textarea
            id="full_description"
            name="full_description"
            rows={3}
            placeholder="Detalhes técnicos, escopo e benefícios..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label htmlFor="is_featured" className="text-xs font-semibold text-slate-700">
            Destacar este serviço com badge especial
          </label>
        </div>

        <div className="pt-2">
          <SubmitButton
            label="Adicionar Serviço ao Catálogo"
            loadingLabel="Adicionando..."
            icon={<Plus size={16} />}
            className="w-full py-2.5"
          />
        </div>
      </form>
    </>
  );
}
