"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, destroySession } from "@/lib/session";
import { createOffer, archiveOffer } from "@/lib/db/offers";
import { listStatsForOffer } from "@/lib/db/stats";
import { Network } from "@/lib/connectors/types";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return { error: "Неверный пароль" };
  }

  await createSession();
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function createOfferAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const name = String(formData.get("name") || "").trim();
  const network = String(formData.get("network") || "") as Network;
  const cabinetUrl = String(formData.get("cabinet_url") || "").trim();
  const startDate = String(formData.get("start_date") || "").trim();

  if (!name) return { error: "Укажите название оффера" };
  if (network !== "leon" && network !== "1xbet") {
    return { error: "Выберите партнёрку" };
  }
  if (!startDate) return { error: "Укажите дату старта" };

  await createOffer({ name, network, cabinet_url: cabinetUrl, start_date: startDate });
  revalidatePath("/");
  return null;
}

export async function archiveOfferAction(offerId: string) {
  await archiveOffer(offerId);
  revalidatePath("/");
}

export async function getOfferStatsAction(offerId: string) {
  return listStatsForOffer(offerId);
}
