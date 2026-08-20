"use client";

import { useFormStatus } from "react-dom";
import { deleteServiceAction } from "@/app/actions/admin-actions";
import { Trash2, Loader2 } from "lucide-react";

function DeleteBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title="Remover serviço"
      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={16} className="animate-spin text-rose-500" /> : <Trash2 size={16} />}
    </button>
  );
}

export function DeleteServiceButton({ serviceId }: { serviceId: string }) {
  async function handleDelete(formData: FormData) {
    if (confirm("Tem certeza que deseja remover este serviço do catálogo?")) {
      await deleteServiceAction(serviceId);
    }
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="service_id" value={serviceId} />
      <DeleteBtn />
    </form>
  );
}
