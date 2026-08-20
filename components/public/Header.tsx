"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TenantWithRelations } from "@/lib/tenant";
import { buildWhatsAppLink, formatPhone } from "@/lib/utils";
import { Phone, MessageCircle, Menu, X, ShieldCheck } from "lucide-react";

interface HeaderProps {
  tenant: TenantWithRelations;
}

export function Header({ tenant }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content, theme, settings } = tenant;

  const whatsappUrl = content
    ? buildWhatsAppLink(
        content.whatsapp_number,
        `Olá! Vim pelo site da ${tenant.name} e gostaria de solicitar um atendimento.`
      )
    : "#";

  return (
    <header className="sticky top-0 z-50 w-full glass-header transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            {theme?.logo_url ? (
              <div className="relative h-12 w-36 sm:w-44 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                <Image
                  src={theme.logo_url}
                  alt={tenant.name}
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 144px, 176px"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-tenant-primary text-white font-bold shadow-sm">
                  {tenant.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                    {tenant.name}
                  </span>
                  {content?.professional_register && (
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-tenant-secondary" />
                      {content.professional_register}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            {settings?.show_services && (
              <Link
                href="#servicos"
                className="transition-colors hover:text-tenant-secondary"
              >
                Serviços
              </Link>
            )}
            {settings?.show_about && (
              <Link
                href="#sobre"
                className="transition-colors hover:text-tenant-secondary"
              >
                Sobre Nós
              </Link>
            )}
            {settings?.show_badges && (
              <Link
                href="#diferenciais"
                className="transition-colors hover:text-tenant-secondary"
              >
                Diferenciais
              </Link>
            )}
            {settings?.show_faq && (
              <Link
                href="#faq"
                className="transition-colors hover:text-tenant-secondary"
              >
                Dúvidas
              </Link>
            )}
            {settings?.show_contact_form && (
              <Link
                href="#contato"
                className="transition-colors hover:text-tenant-secondary"
              >
                Contato
              </Link>
            )}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {content?.phone && (
              <a
                href={`tel:${content.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-tenant-secondary transition-colors"
              >
                <Phone size={15} className="text-slate-400" />
                <span>{formatPhone(content.phone)}</span>
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-95"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              aria-label="Falar no WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-800">
            {settings?.show_services && (
              <Link
                href="#servicos"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:bg-slate-50"
              >
                Serviços Especializados
              </Link>
            )}
            {settings?.show_about && (
              <Link
                href="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:bg-slate-50"
              >
                Sobre a Empresa
              </Link>
            )}
            {settings?.show_badges && (
              <Link
                href="#diferenciais"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:bg-slate-50"
              >
                Certificações e Normas
              </Link>
            )}
            {settings?.show_faq && (
              <Link
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:bg-slate-50"
              >
                Perguntas Frequentes
              </Link>
            )}
            {settings?.show_contact_form && (
              <Link
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:bg-slate-50"
              >
                Fale Conosco
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            {content?.phone && (
              <a
                href={`tel:${content.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-sm text-slate-700 py-1"
              >
                <Phone size={16} className="text-slate-400" />
                <span>{formatPhone(content.phone)}</span>
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            >
              <MessageCircle size={18} />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
