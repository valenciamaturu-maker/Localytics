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
          <div className="mt-4 flex items-center gap-3 opacity-80">
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">Works with</span>
            <div className="flex items-center gap-2.5 grayscale">
              <svg aria-label="WhatsApp" role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
              <svg aria-label="Instagram" role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <svg aria-label="TikTok" role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.16a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.59z"/></svg>
              <svg aria-label="Facebook" role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
          </div>
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
