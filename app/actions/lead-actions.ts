"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const leadSchema = z.object({
  tenant_id: z.string().min(1, "Tenant ID obrigatório"),
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z.string().min(8, "Informe um telefone válido"),
  service_interest: z.string().optional(),
  message: z.string().optional(),
});

export type CreateLeadState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createLeadAction(
  prevState: CreateLeadState,
  formData: FormData
): Promise<CreateLeadState> {
  const rawData = {
    tenant_id: formData.get("tenant_id") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    service_interest: (formData.get("service_interest") as string) || undefined,
    message: (formData.get("message") as string) || undefined,
  };

  const parsed = leadSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Por favor, corrija os erros no formulário.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.lead.create({
      data: {
        tenant_id: parsed.data.tenant_id,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        service_interest: parsed.data.service_interest,
        message: parsed.data.message,
        status: "NEW",
      },
    });

    return {
      success: true,
      message: "Solicitação enviada com sucesso! Nossa equipe técnica entrará em contato em breve.",
    };
  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return {
      success: false,
      message: "Ocorreu um erro ao enviar sua mensagem. Tente novamente ou chame no WhatsApp.",
    };
  }
}
