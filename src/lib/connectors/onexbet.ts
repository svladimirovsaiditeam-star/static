import { Offer, StatsConnector, StatsSnapshot } from "./types";

// Реальный коннектор для самописного кабинета 1xBet — подключим,
// когда будет известен способ получения данных (JSON-эндпоинт или
// Playwright-скрипт логина).
export const onexbetConnector: StatsConnector = {
  async getStats(_offer: Offer): Promise<StatsSnapshot> {
    throw new Error("Коннектор 1xBet ещё не подключён");
  },
};
