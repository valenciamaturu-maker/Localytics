import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Upload, PencilLine, BarChart3, Trash2, Database } from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(storage.getSales().length);
  }, []);

  const seedDemo = () => {
    const demo = [
      { product: "Ankara Dress", quantity: 3, price: 2500, date: "2025-03-01", platform: "TikTok" },
      { product: "Ankara Dress", quantity: 2, price: 2500, date: "2025-03-04", platform: "Instagram" },
      { product: "Beaded Earrings", quantity: 10, price: 450, date: "2025-03-05", platform: "TikTok" },
      { product: "Leather Sandals", quantity: 4, price: 1800, date: "2025-03-08", platform: "Instagram" },
      { product: "Ankara Dress", quantity: 5, price: 2500, date: "2025-03-12", platform: "TikTok" },
      { product: "Beaded Earrings", quantity: 8, price: 450, date: "2025-03-14", platform: "TikTok" },
      { product: "Headwrap", quantity: 6, price: 800, date: "2025-03-16", platform: "Instagram" },
      { product: "Ankara Dress", quantity: 7, price: 2500, date: "2025-03-20", platform: "TikTok" },
    ];
    storage.setPending(demo);
    toast({ title: "Demo data loaded", description: "8 sample sales ready to validate." });
    navigate("/quality");
  };

  const clearAll = () => {
    storage.clearSales();
    storage.clearPending();
    setCount(0);
    toast({ title: "All local data cleared" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Insights for social sellers" />
      <main className="container max-w-2xl py-6 space-y-6 animate-fade-in">
        <section className="rounded-3xl gradient-hero text-primary-foreground p-6 shadow-medium">
          <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Welcome back</p>
          <h2 className="text-2xl font-bold mt-1 leading-tight">
            Turn your social sales into clear insights.
          </h2>
          <p className="text-sm opacity-90 mt-2">
            Works offline. Your data stays on your phone.
          </p>
          {count > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium">
              <Database className="w-4 h-4" />
              {count} sales saved locally
            </div>
          )}
        </section>

        <section className="grid gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Add your sales</h3>

          <Link to="/upload">
            <button className="w-full text-left p-5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium hover:border-primary/30 transition-smooth flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Upload CSV or Excel</p>
                <p className="text-sm text-muted-foreground">Bulk import from a file</p>
              </div>
            </button>
          </Link>

          <Link to="/manual">
            <button className="w-full text-left p-5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium hover:border-primary/30 transition-smooth flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent-foreground flex items-center justify-center shrink-0">
                <PencilLine className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Enter sales manually</p>
                <p className="text-sm text-muted-foreground">Add one record at a time</p>
              </div>
            </button>
          </Link>

          {count > 0 && (
            <Link to="/dashboard">
              <button className="w-full text-left p-5 rounded-2xl gradient-primary text-primary-foreground shadow-glow hover:scale-[1.01] transition-smooth flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">View Insights Dashboard</p>
                  <p className="text-sm opacity-90">See revenue, top products & trends</p>
                </div>
              </button>
            </Link>
          )}
        </section>

        <section className="flex flex-col gap-2 pt-2">
          <Button variant="outline" onClick={seedDemo} className="rounded-xl h-12">
            Try with demo data
          </Button>
          {count > 0 && (
            <Button variant="ghost" onClick={clearAll} className="rounded-xl h-11 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Clear all local data
            </Button>
          )}
        </section>

        <p className="text-center text-xs text-muted-foreground pt-2">
          🔒 100% offline · No accounts · No tracking
        </p>
      </main>
    </div>
  );
};

export default Home;
