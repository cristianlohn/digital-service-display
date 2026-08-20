"use client";

import { useState, useRef } from "react";
import { createAdminUserAction } from "@/app/actions/user-actions";
import { SubmitButton } from "./SubmitButton";
import { FeedbackToast } from "./FeedbackToast";
import { UserPlus, CheckCircle2, Shield, Building2 } from "lucide-react";

interface CreateUserFormProps {
  tenants: Array<{ id: string; name: string; slug: string }>;
}

export function CreateUserForm({ tenants }: CreateUserFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "TENANT_ADMIN">("TENANT_ADMIN");
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });

  async function handleSubmit(formData: FormData) {
    setFeedback({ status: null, message: null });

    const result = await createAdminUserAction(formData);

    if (result.success) {
      setFeedback({
        status: "success",
        message: result.message || "Usuário criado com sucesso!",
      });
      formRef.current?.reset();
      setSelectedRole("TENANT_ADMIN");
    } else {
      setFeedback({
        status: "error",
        message: result.message || "Erro ao cadastrar usuário.",
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
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Nome do Usuário *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Ex: João da Silva"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            E-mail de Login *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="joao@empresa.com.br"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Senha Temporária / Inicial *
          </label>
          <input
            type="text"
            id="password"
            name="password"
            required
            minLength={6}
            placeholder="Senha com no mínimo 6 caracteres"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Nível de Permissão (Papel) *
          </label>
          <select
            id="role"
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white"
          >
            <option value="TENANT_ADMIN">Gestor de Empresa (Acesso apenas à sua empresa)</option>
            <option value="SUPER_ADMIN">Super Administrador (Acesso a todas as empresas)</option>
          </select>
        </div>

        {selectedRole === "TENANT_ADMIN" && (
          <div>
            <label htmlFor="tenant_id" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Empresa Vinculada *
            </label>
            <select
              id="tenant_id"
              name="tenant_id"
              required={selectedRole === "TENANT_ADMIN"}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white"
            >
              <option value="">Selecione uma empresa...</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-2">
          <SubmitButton
            label="Cadastrar Usuário"
            loadingLabel="Criando Usuário..."
            icon={<UserPlus size={16} />}
            className="w-full py-2.5"
          />
        </div>
      </form>
    </>
  );
}
