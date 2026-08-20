import Link from "next/link";
import { TenantWithRelations } from "@/lib/tenant";
import { formatCNPJ, formatPhone } from "@/lib/utils";
import { CatutoBrand } from "./CatutoBrand";
import { ShieldCheck, MapPin, Mail, Phone, ArrowUp, Instagram, Linkedin, Facebook, Youtube, ExternalLink } from "lucide-react";

interface FooterProps {
  tenant: TenantWithRelations;
}

export function Footer({ tenant }: FooterProps) {
  const { content, settings, services } = tenant;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-900">
          {/* Brand & Corporate Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xl font-bold text-white tracking-tight">
              {tenant.name}
            </div>
            {content?.hero_subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                {content.hero_subtitle}
              </p>
            )}

            {content?.professional_register && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-300 border border-slate-800">
                <ShieldCheck size={14} className="text-tenant-secondary" />
                <span>{content.professional_register}</span>
              </div>
            )}

            {/* Social Media Links */}
            {(content?.instagram_url || content?.linkedin_url || content?.facebook_url || content?.youtube_url) && (
              <div className="pt-2 flex items-center gap-2.5">
                {content?.instagram_url && (
                  <a
                    href={content.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={17} />
                  </a>
                )}
                {content?.linkedin_url && (
                  <a
                    href={content.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={17} />
                  </a>
                )}
                {content?.facebook_url && (
                  <a
                    href={content.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-blue-500 hover:bg-slate-800 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={17} />
                  </a>
                )}
                {content?.youtube_url && (
                  <a
                    href={content.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={17} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {settings?.show_services && (
                <li>
                  <Link href="#servicos" className="hover:text-white transition-colors">
                    Serviços
                  </Link>
                </li>
              )}
              {settings?.show_about && (
                <li>
                  <Link href="#sobre" className="hover:text-white transition-colors">
                    Sobre Nós
                  </Link>
                </li>
              )}
              {settings?.show_badges && (
                <li>
                  <Link href="#diferenciais" className="hover:text-white transition-colors">
                    Diferenciais
                  </Link>
                </li>
              )}
              {settings?.show_faq && (
                <li>
                  <Link href="#faq" className="hover:text-white transition-colors">
                    Perguntas Frequentes
                  </Link>
                </li>
              )}
              {settings?.show_contact_form && (
                <li>
                  <Link href="#contato" className="hover:text-white transition-colors">
                    Fale Conosco
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Key Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Especialidades
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.id} className="truncate">
                  <Link href="#servicos" className="hover:text-white transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate & Address Details */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Dados Cadastrais
            </h4>
            {content && (
              <div className="space-y-2 text-slate-400">
                {(content.address_street || content.address_city) && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>
                      {content.address_street ? `${content.address_street}${content.address_number ? `, ${content.address_number}` : ""}${content.address_neighborhood ? ` - ${content.address_neighborhood}` : ""}` : ""}
                      {content.address_city ? (
                        <>
                          <br />
                          {content.address_city}{content.address_state ? ` - ${content.address_state}` : ""}{content.address_zip ? ` | CEP ${content.address_zip}` : ""}
                        </>
                      ) : null}
                    </span>
                  </div>
                )}

                {content.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-500 flex-shrink-0" />
                    <span>{formatPhone(content.phone)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-500 flex-shrink-0" />
                  <span className="break-all">{content.email}</span>
                </div>

                {content.cnpj && (
                  <div className="pt-2 text-[11px] text-slate-500">
                    CNPJ: {formatCNPJ(content.cnpj)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 text-center sm:text-left">
          <div>
            &copy; {currentYear} {tenant.name}. Todos os direitos reservados.
          </div>

          {/* Catuto Soluções Digitais Official Brand Badge */}
          <CatutoBrand />

          <div>
            <a
              href="#"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors inline-block"
              aria-label="Voltar ao topo"
            >
              <ArrowUp size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
