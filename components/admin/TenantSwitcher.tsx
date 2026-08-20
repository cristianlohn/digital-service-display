"use client";

import { useTransition } from "react";
import { switchAdminTenantAction } from "@/app/actions/tenant-switch-action";
import { Building2, Loader2 } from "lucide-react";

interface TenantSwitcherProps {
  currentTenantId: string;
  tenants: Array<{ id: string; name: string; slug: string }>;
}

export function TenantSwitcher({ currentTenantId, tenants }: TenantSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTenantId = e.target.value;
    startTransition(async () => {
      await switchAdminTenantAction(newTenantId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
        {isPending ? (
          <Loader2 size={14} className="animate-spin text-slate-600" />
        ) : (
          <Building2 size={14} className="text-slate-600" />
        )}
        <span className="text-slate-500 font-normal">Empresa:</span>
        <select
          value={currentTenantId}
          onChange={handleChange}
          disabled={isPending}
          className="bg-transparent font-bold text-slate-900 cursor-pointer outline-none"
        >
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.slug})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
