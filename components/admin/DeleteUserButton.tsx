"use client";

import { useFormStatus } from "react-dom";
import { deleteAdminUserAction } from "@/app/actions/user-actions";
import { Trash2, Loader2 } from "lucide-react";

function DeleteBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title="Remover usuário"
      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={16} className="animate-spin text-rose-500" /> : <Trash2 size={16} />}
    </button>
  );
}

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  async function handleDelete() {
    if (confirm(`Tem certeza que deseja remover o acesso do usuário "${userName}"?`)) {
      await deleteAdminUserAction(userId);
    }
  }

  return (
    <form action={handleDelete}>
      <DeleteBtn />
    </form>
  );
}
