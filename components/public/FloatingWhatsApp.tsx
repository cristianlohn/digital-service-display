"use client";

import { TenantWithRelations } from "@/lib/tenant";
import { buildWhatsAppLink } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  tenant: TenantWithRelations;
}

export function FloatingWhatsApp({ tenant }: FloatingWhatsAppProps) {
  const { content } = tenant;

  if (!content?.whatsapp_number) return null;

  const whatsappUrl = buildWhatsAppLink(
    content.whatsapp_number,
    `Olá! Vim pelo site da ${tenant.name} e gostaria de solicitar um orçamento.`
  );

  return (
    <aside aria-label="Atendimento via WhatsApp" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg pointer-events-none whitespace-nowrap">
        Fale conosco no WhatsApp
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-emerald-600 active:scale-95 animate-pulse-slow"
        aria-label="Iniciar conversa no WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600"></span>
        </span>
        <MessageCircle size={30} />
      </a>
    </aside>
  );
}
