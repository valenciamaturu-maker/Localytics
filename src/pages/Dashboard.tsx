import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingBag,
  DollarSign,
  Package,
  Sparkles,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { computeInsights, formatKES } from "@/lib/insights";
import { SaleRecord } from "@/lib/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const s = storage.getSales();
    if (!s.length) {
      navigate("/");
      return;
    }
    setSales(s);
    setDirty(storage.isDirty());
  }, [navigate]);

  const insights = useMemo(() => computeInsights(sales), [sales]);

  if (!sales.length) return null;

  const TrendIcon =
    insights.trend.direction === "up" ? TrendingUp : insights.trend.direction === "down" ? TrendingDown : Minus;
  const trendColor =
    insights.trend.direction === "up"
      ? "text-success bg-success/10"
      : insights.trend.direction === "down"
        ? "text-destructive bg-destructive/10"
        : "text-muted-foreground bg-secondary";

  const maxProductRev = Math.max(...insights.byProduct.map((p) => p.revenue), 1);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader subtitle="Insights Dashboard" />
      <main className="container max-w-2xl py-6 space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Home
          </Link>
          <span className="text-xs text-muted-foreground">{sales.length} total sales</span>
        </div>

        {dirty && (
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-3 flex items-start gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="text-foreground/90">
              Some data issues detected — results may not be fully accurate.
            </p>
          </div>
        )}

        {/* Hero metric */}
        <section className="rounded-3xl gradient-hero text-primary-foreground p-6 shadow-medium">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Total revenue</p>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              {insights.trend.direction === "flat" ? "Stable" : `${Math.abs(insights.trend.pct).toFixed(0)}%`}
            </div>
          </div>
          <p className="text-4xl font-bold mt-2 tracking-tight">{formatKES(insights.totalRevenue)}</p>
          <div className="flex gap-4 mt-4 text-sm opacity-90">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" /> {insights.totalOrders} orders
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4" /> {insights.totalUnits} units
            </span>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> TOP PRODUCT
            </div>
            <p className="font-bold mt-2 truncate">{insights.topProduct?.name || "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {insights.topProduct ? formatKES(insights.topProduct.revenue) : ""}
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
              <DollarSign className="w-3.5 h-3.5" /> BEST PLATFORM
            </div>
            <p className="font-bold mt-2 truncate">{insights.bestPlatform?.name || "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {insights.bestPlatform ? `${(insights.bestPlatform.share * 100).toFixed(0)}% of revenue` : ""}
            </p>
          </div>
        </section>

        {/* Insights cards */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold px-1">Key insights</h3>
          {insights.narratives.map((n, i) => (
            <div
              key={i}
              className="rounded-2xl bg-card border border-border p-4 flex gap-3 shadow-soft animate-scale-in"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-sm leading-relaxed pt-1.5">{n}</p>
            </div>
          ))}
        </section>

        {/* Top products bar */}
        {insights.byProduct.length > 0 && (
          <section className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <h3 className="text-sm font-semibold mb-4">Top products by revenue</h3>
            <div className="space-y-3">
              {insights.byProduct.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium truncate pr-2">{p.name}</span>
                    <span className="text-muted-foreground tabular-nums shrink-0">{formatKES(p.revenue)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-smooth"
                      style={{ width: `${(p.revenue / maxProductRev) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Platform split */}
        {insights.byPlatform.length > 0 && (
          <section className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <h3 className="text-sm font-semibold mb-4">Sales by platform</h3>
            <div className="flex h-3 rounded-full overflow-hidden">
              {insights.byPlatform.map((p, i) => (
                <div
                  key={p.name}
                  className={i === 0 ? "bg-primary" : i === 1 ? "bg-accent" : "bg-muted-foreground"}
                  style={{ width: `${p.share * 100}%` }}
                  title={p.name}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-xs">
              {insights.byPlatform.map((p, i) => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === 0 ? "bg-primary" : i === 1 ? "bg-accent" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">{(p.share * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate("/upload")} className="h-12 rounded-xl">
            <Plus className="w-4 h-4 mr-1" /> Upload more
          </Button>
          <Button onClick={() => navigate("/manual")} className="h-12 rounded-xl gradient-primary">
            <Plus className="w-4 h-4 mr-1" /> Add sale
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
