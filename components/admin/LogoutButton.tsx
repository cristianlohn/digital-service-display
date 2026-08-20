"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/app/actions/auth-actions";
import { LogOut, Loader2 } from "lucide-react";

function LogoutBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors border border-rose-500/20 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <LogOut size={14} />
      )}
      <span>{pending ? "Saindo..." : "Encerrar Sessão"}</span>
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction} className="w-full">
      <LogoutBtn />
    </form>
  );
}
