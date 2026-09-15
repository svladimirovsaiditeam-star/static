import { Offer, StatsConnector, StatsSnapshot } from "./types";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Заглушка: возвращает правдоподобные случайные цифры за день.
// Нужна, чтобы проверить весь остальной функционал (БД, cron, графики),
// не дожидаясь доступа к реальным кабинетам партнёрок.
export const mockConnector: StatsConnector = {
  async getStats(_offer: Offer): Promise<StatsSnapshot> {
    const clicks = randomInt(50, 500);
    const registrations = randomInt(2, Math.max(3, Math.floor(clicks * 0.15)));
    const ftdCount = randomInt(0, Math.max(1, Math.floor(registrations * 0.4)));
    const ftdAmount = ftdCount * randomInt(500, 3000);
    const revenue = Math.round(ftdAmount * (0.3 + Math.random() * 0.3));

    return { clicks, registrations, ftdCount, ftdAmount, revenue };
  },
};
