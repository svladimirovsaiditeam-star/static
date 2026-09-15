import { Network, StatsConnector } from "./types";
import { mockConnector } from "./mock";

// Пока оба коннектора не готовы — используем заглушку для обеих партнёрок.
// Когда появится реальный доступ к кабинету, заменить конкретную строку
// на leonConnector / onexbetConnector из соседних файлов.
const connectors: Record<Network, StatsConnector> = {
  leon: mockConnector,
  "1xbet": mockConnector,
};

export function getConnector(network: Network): StatsConnector {
  return connectors[network];
}
