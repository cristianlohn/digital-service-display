"use client";

import { useFormStatus } from "react-dom";
import { Loader2, CheckCircle2 } from "lucide-react";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SubmitButton({
  label,
  loadingLabel = "Salvando alterações...",
  icon = <CheckCircle2 size={16} />,
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 ${className}`}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin text-emerald-400" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
