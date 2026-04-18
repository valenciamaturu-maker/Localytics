import { SaleRecord } from "./types";

export interface Insights {
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  topProduct: { name: string; revenue: number } | null;
  bestPlatform: { name: string; revenue: number; share: number } | null;
  trend: { direction: "up" | "down" | "flat"; pct: number };
  narratives: string[];
  byProduct: { name: string; revenue: number; units: number }[];
  byPlatform: { name: string; revenue: number; share: number }[];
}

export function computeInsights(sales: SaleRecord[]): Insights {
  if (!sales.length) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalUnits: 0,
      topProduct: null,
      bestPlatform: null,
      trend: { direction: "flat", pct: 0 },
      narratives: [],
      byProduct: [],
      byPlatform: [],
    };
  }

  const totalRevenue = sales.reduce((s, r) => s + r.price * r.quantity, 0);
  const totalUnits = sales.reduce((s, r) => s + r.quantity, 0);
  const totalOrders = sales.length;

  const productMap = new Map<string, { revenue: number; units: number }>();
  const platformMap = new Map<string, number>();
  for (const s of sales) {
    const rev = s.price * s.quantity;
    const p = productMap.get(s.product) || { revenue: 0, units: 0 };
    p.revenue += rev;
    p.units += s.quantity;
    productMap.set(s.product, p);
    platformMap.set(s.platform, (platformMap.get(s.platform) || 0) + rev);
  }

  const byProduct = [...productMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue);
  const byPlatform = [...platformMap.entries()]
    .map(([name, revenue]) => ({ name, revenue, share: revenue / totalRevenue }))
    .sort((a, b) => b.revenue - a.revenue);

  const topProduct = byProduct[0] ? { name: byProduct[0].name, revenue: byProduct[0].revenue } : null;
  const bestPlatform = byPlatform[0] || null;

  // Trend: split sales by date into two halves
  const sorted = [...sales].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const mid = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, mid).reduce((s, r) => s + r.price * r.quantity, 0);
  const secondHalf = sorted.slice(mid).reduce((s, r) => s + r.price * r.quantity, 0);
  let direction: "up" | "down" | "flat" = "flat";
  let pct = 0;
  if (firstHalf > 0) {
    pct = ((secondHalf - firstHalf) / firstHalf) * 100;
    direction = pct > 5 ? "up" : pct < -5 ? "down" : "flat";
  } else if (secondHalf > 0) {
    direction = "up";
    pct = 100;
  }

  // Narratives
  const narratives: string[] = [];
  if (topProduct) {
    const share = (topProduct.revenue / totalRevenue) * 100;
    narratives.push(`Your top product is ${topProduct.name} (${share.toFixed(0)}% of revenue).`);
  }
  // Pareto check: how many products contribute 80% of revenue
  let acc = 0;
  let count = 0;
  for (const p of byProduct) {
    acc += p.revenue;
    count++;
    if (acc / totalRevenue >= 0.8) break;
  }
  if (byProduct.length > 1) {
    narratives.push(`80% of revenue comes from ${count} product${count > 1 ? "s" : ""} — focus your marketing there.`);
  }
  if (bestPlatform) {
    narratives.push(
      `${bestPlatform.name} is your best channel (${(bestPlatform.share * 100).toFixed(0)}% of sales). Double down on it.`,
    );
  }
  // Restock suggestion: highest unit-velocity product
  const fastMover = [...byProduct].sort((a, b) => b.units - a.units)[0];
  if (fastMover) {
    narratives.push(`You should restock ${fastMover.name} — ${fastMover.units} units sold.`);
  }
  if (direction !== "flat") {
    narratives.push(
      direction === "up"
        ? `Sales are trending up ${Math.abs(pct).toFixed(0)}% — momentum is on your side.`
        : `Sales dropped ${Math.abs(pct).toFixed(0)}% recently — review pricing or promotions.`,
    );
  }

  return {
    totalRevenue,
    totalOrders,
    totalUnits,
    topProduct,
    bestPlatform,
    trend: { direction, pct },
    narratives: narratives.slice(0, 4),
    byProduct: byProduct.slice(0, 5),
    byPlatform,
  };
}

export const formatKES = (n: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);
