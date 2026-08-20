"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LeadStatus } from "@prisma/client";

// 1. Atualizar Toggles de Seções
export async function updateSectionTogglesAction(tenantId: string, settingsData: {
  show_hero?: boolean;
  show_about?: boolean;
  show_mission?: boolean;
  show_services?: boolean;
  show_badges?: boolean;
  show_faq?: boolean;
  show_testimonials?: boolean;
  show_contact_form?: boolean;
  show_map?: boolean;
  show_footer?: boolean;
}) {
  try {
    await prisma.tenantSettings.upsert({
      where: { tenant_id: tenantId },
      update: settingsData,
      create: {
        tenant_id: tenantId,
        ...settingsData,
      },
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Configurações de seções salvas com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar seções:", error);
    return { success: false, message: "Erro ao salvar configurações." };
  }
}

// 2. Atualizar Tema Visual
export async function updateThemeAction(tenantId: string, themeData: {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  logo_url?: string;
  favicon_url?: string;
  dark_mode_enabled?: boolean;
}) {
  try {
    await prisma.tenantTheme.upsert({
      where: { tenant_id: tenantId },
      update: themeData,
      create: {
        tenant_id: tenantId,
        ...themeData,
      },
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Tema visual atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar tema:", error);
    return { success: false, message: "Erro ao salvar tema." };
  }
}

// 3. Atualizar Conteúdo & Dados Legais
export async function updateContentAction(tenantId: string, formData: FormData) {
  try {
    const valuesString = (formData.get("values") as string) || "";
    const valuesArray = valuesString
      .split("\n")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const data = {
      hero_title: formData.get("hero_title") as string,
      hero_subtitle: formData.get("hero_subtitle") as string,
      cta_primary_text: formData.get("cta_primary_text") as string,
      cta_whatsapp_text: formData.get("cta_whatsapp_text") as string,
      hero_image_url: (formData.get("hero_image_url") as string) || null,

      about_badge_text: (formData.get("about_badge_text") as string) || null,
      about_title: formData.get("about_title") as string,
      about_description: formData.get("about_description") as string,
      founded_year: formData.get("founded_year") ? parseInt(formData.get("founded_year") as string) : null,
      about_image_url: (formData.get("about_image_url") as string) || null,

      mission_text: (formData.get("mission_text") as string) || null,
      vision_text: (formData.get("vision_text") as string) || null,
      values: valuesArray,

      phone: (formData.get("phone") as string) || null,
      whatsapp_number: formData.get("whatsapp_number") as string,
      email: formData.get("email") as string,
      address_street: formData.get("address_street") as string,
      address_number: formData.get("address_number") as string,
      address_neighborhood: formData.get("address_neighborhood") as string,
      address_city: formData.get("address_city") as string,
      address_state: formData.get("address_state") as string,
      address_zip: formData.get("address_zip") as string,
      cnpj: formData.get("cnpj") as string,
      professional_register: (formData.get("professional_register") as string) || null,
      working_hours: (formData.get("working_hours") as string) || null,
    };

    await prisma.tenantContent.upsert({
      where: { tenant_id: tenantId },
      update: data,
      create: {
        tenant_id: tenantId,
        ...data,
      },
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Conteúdo salvo com sucesso!" };
  } catch (error) {
    console.error("Erro ao salvar conteúdo:", error);
    return { success: false, message: "Erro ao atualizar o conteúdo." };
  }
}

// 4. CRUD de Serviços
export async function createServiceAction(tenantId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const short_description = formData.get("short_description") as string;
    const full_description = (formData.get("full_description") as string) || null;
    const icon_name = (formData.get("icon_name") as string) || "Zap";
    const category_id = (formData.get("category_id") as string) || null;
    const is_featured = formData.get("is_featured") === "on";

    await prisma.service.create({
      data: {
        tenant_id: tenantId,
        title,
        short_description,
        full_description,
        icon_name,
        category_id: category_id === "" ? null : category_id,
        is_featured,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/services");
    return { success: true, message: "Serviço cadastrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return { success: false, message: "Erro ao criar serviço." };
  }
}

export async function deleteServiceAction(serviceId: string) {
  try {
    await prisma.service.delete({
      where: { id: serviceId },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/services");
    return { success: true, message: "Serviço excluído!" };
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    return { success: false, message: "Erro ao excluir serviço." };
  }
}

// 5. Atualizar Status do Lead
export async function updateLeadStatusAction(leadId: string, status: LeadStatus) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true, message: "Status do lead atualizado!" };
  } catch (error) {
    console.error("Erro ao atualizar status do lead:", error);
    return { success: false, message: "Erro ao atualizar status." };
  }
}
