"use client";

import { useFormState, useFormStatus } from "react-dom";
import { TenantWithRelations } from "@/lib/tenant";
import { createLeadAction, CreateLeadState } from "@/app/actions/lead-actions";
import { buildWhatsAppLink, formatCNPJ, formatPhone } from "@/lib/utils";
import { WhatsAppIcon } from "./WhatsAppIcon";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
} from "lucide-react";

interface ContactSectionProps {
  tenant: TenantWithRelations;
}

const initialState: CreateLeadState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
    >
      <Send size={18} />
      <span>{pending ? "Enviando Proposta..." : "Enviar Mensagem / Solicitar Orçamento"}</span>
    </button>
  );
}

export function ContactSection({ tenant }: ContactSectionProps) {
  const [state, formAction] = useFormState(createLeadAction, initialState);
  const { content, services } = tenant;

  if (!content) return null;

  const whatsappUrl = buildWhatsAppLink(
    content.whatsapp_number,
    `Olá! Vim pelo site da ${tenant.name} e gostaria de solicitar um orçamento.`
  );

  return (
    <section id="contato" className="py-20 sm:py-28 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-tenant-secondary">
            Canais de Atendimento
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mt-2">
            Fale com Nossos Especialistas
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Solicite um orçamento sem compromisso ou tire suas dúvidas técnicas diretamente com nossa equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info & Legal Badges */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-slate-900 text-white p-8 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Informações de Contato
              </h3>

              <div className="space-y-4 text-sm">
                {content.phone && (
                  <a
                    href={`tel:${content.phone.replace(/\D/g, "")}`}
                    className="flex items-start gap-3.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-white/10 text-tenant-secondary flex-shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Telefone / Fixo</div>
                      <div className="font-semibold text-white">{formatPhone(content.phone)}</div>
                    </div>
                  </a>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="p-2 rounded-lg bg-[#25D366]/20 text-[#25D366] flex-shrink-0">
                    <WhatsAppIcon size={18} fillColor="#25D366" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">WhatsApp Comercial</div>
                    <div className="font-semibold text-white">{formatPhone(content.whatsapp_number)}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${content.email}`}
                  className="flex items-start gap-3.5 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="p-2 rounded-lg bg-white/10 text-tenant-secondary flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">E-mail Direto</div>
                    <div className="font-semibold text-white break-all">{content.email}</div>
                  </div>
                </a>

                {(content.address_street || content.address_city) && (
                  <div className="flex items-start gap-3.5 text-slate-300">
                    <div className="p-2 rounded-lg bg-white/10 text-tenant-secondary flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Localização / Atendimento</div>
                      <div className="font-semibold text-white">
                        {content.address_street}
                        {content.address_number ? `, ${content.address_number}` : ""}
                        {content.address_neighborhood ? ` - ${content.address_neighborhood}` : ""}
                      </div>
                      {content.address_city && (
                        <div className="text-xs text-slate-400">
                          {content.address_city}
                          {content.address_state ? ` - ${content.address_state}` : ""}
                          {content.address_zip ? ` | CEP: ${content.address_zip}` : ""}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {content.working_hours && (
                  <div className="flex items-start gap-3.5 text-slate-300">
                    <div className="p-2 rounded-lg bg-white/10 text-tenant-secondary flex-shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Horário de Atendimento</div>
                      <div className="font-semibold text-white text-xs">{content.working_hours}</div>
                    </div>
                  </div>
                )}

                {/* Social Networks inside Contact Card */}
                {(content.instagram_url || content.linkedin_url || content.facebook_url || content.youtube_url) && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-xs text-slate-400 font-medium">Redes Sociais Oficiais</div>
                    <div className="flex items-center gap-2">
                      {content.instagram_url && (
                        <a
                          href={content.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-pink-400 hover:bg-slate-700 transition-colors"
                          aria-label="Instagram"
                        >
                          <Instagram size={17} />
                        </a>
                      )}
                      {content.linkedin_url && (
                        <a
                          href={content.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={17} />
                        </a>
                      )}
                      {content.facebook_url && (
                        <a
                          href={content.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-500 hover:bg-slate-700 transition-colors"
                          aria-label="Facebook"
                        >
                          <Facebook size={17} />
                        </a>
                      )}
                      {content.youtube_url && (
                        <a
                          href={content.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
                          aria-label="YouTube"
                        >
                          <Youtube size={17} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Fast WhatsApp Button */}
              <div className="pt-4 border-t border-slate-800">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-[#20bd5a] transition-all"
                >
                  <WhatsAppIcon size={19} fillColor="#FFFFFF" />
                  <span>Conversar Imediatamente no WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Legal Badges Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-white shadow-sm text-slate-900">
                <ShieldCheck size={26} />
              </div>
              <div className="text-xs text-slate-600">
                <div className="font-bold text-slate-900">
                  {tenant.name}
                </div>
                <div>CNPJ: {formatCNPJ(content.cnpj)} {content.professional_register && `| ${content.professional_register}`}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Solicite uma Proposta Técnica
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Preencha os campos abaixo com as informações do seu projeto. Retornamos em menos de 24h úteis.
              </p>

              {state?.success && (
                <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm font-medium">{state.message}</div>
                </div>
              )}

              {state?.success === false && state?.message && (
                <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 flex items-start gap-3">
                  <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm font-medium">{state.message}</div>
                </div>
              )}

              <form action={formAction} className="space-y-5">
                <input type="hidden" name="tenant_id" value={tenant.id} />

                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nome Completo / Empresa *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Ex: João da Silva / Metalúrgica Silva"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {state?.errors?.name && (
                    <p className="text-xs text-rose-600 mt-1">{state.errors.name[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      E-mail Corporativo / Pessoal *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="seuemail@empresa.com.br"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    {state?.errors?.email && (
                      <p className="text-xs text-rose-600 mt-1">{state.errors.email[0]}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="(47) 99999-9999"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    {state?.errors?.phone && (
                      <p className="text-xs text-rose-600 mt-1">{state.errors.phone[0]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="service_interest" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Serviço de Interesse
                  </label>
                  <select
                    id="service_interest"
                    name="service_interest"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">Selecione uma especialidade...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Outro / Consultoria Geral">Outro / Consultoria Geral</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Descrição do Projeto ou Necessidade
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Conte-nos detalhes sobre o local da instalação, prazos ou especificações técnicas..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  ></textarea>
                </div>

                <SubmitButton />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
