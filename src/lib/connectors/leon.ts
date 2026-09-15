import { Offer, StatsConnector, StatsSnapshot } from "./types";

// Реальный коннектор для кабинета Leon (Quintessence) — подключим,
// когда будет известен способ получения данных (JSON-эндпоинт или
// Playwright-скрипт логина).
export const leonConnector: StatsConnector = {
  async getStats(_offer: Offer): Promise<StatsSnapshot> {
    throw new Error("Коннектор Leon ещё не подключён");
  },
};
