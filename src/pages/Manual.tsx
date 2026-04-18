import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, ArrowRight } from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

interface Row {
  product: string;
  quantity: string;
  price: string;
  date: string;
  platform: string;
}

const empty = (): Row => ({
  product: "",
  quantity: "",
  price: "",
  date: new Date().toISOString().slice(0, 10),
  platform: "TikTok",
});

const Manual = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([empty()]);

  const update = (i: number, key: keyof Row, val: string) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  };
  const add = () => setRows((r) => [...r, empty()]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  const submit = () => {
    const filled = rows.filter((r) => r.product || r.quantity || r.price);
    if (!filled.length) {
      toast({ title: "Add at least one sale", variant: "destructive" });
      return;
    }
    storage.setPending(filled);
    navigate("/quality");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader />
      <main className="container max-w-2xl py-6 space-y-5 animate-fade-in">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <div>
          <h2 className="text-2xl font-bold">Add sales</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter one row per sale. Tap + to add more.</p>
        </div>

        <div className="space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-4 shadow-soft animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground">Sale #{i + 1}</span>
                {rows.length > 1 && (
                  <button
                    onClick={() => remove(i)}
                    className="text-destructive p-1 hover:bg-destructive/10 rounded-lg"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Product</Label>
                  <Input
                    placeholder="e.g. Ankara Dress"
                    value={row.product}
                    onChange={(e) => update(i, "product", e.target.value)}
                    className="h-11 rounded-xl mt-1"
                    maxLength={80}
                  />
                </div>
                <div>
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={row.quantity}
                    onChange={(e) => update(i, "quantity", e.target.value)}
                    className="h-11 rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Price (KES)</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    value={row.price}
                    onChange={(e) => update(i, "price", e.target.value)}
                    className="h-11 rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={row.date}
                    onChange={(e) => update(i, "date", e.target.value)}
                    className="h-11 rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Platform</Label>
                  <select
                    value={row.platform}
                    onChange={(e) => update(i, "platform", e.target.value)}
                    className="h-11 rounded-xl mt-1 w-full border border-input bg-background px-3 text-sm"
                  >
                    <option>TikTok</option>
                    <option>Instagram</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={add} className="w-full h-12 rounded-xl border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add another sale
          </Button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4">
        <div className="container max-w-2xl">
          <Button onClick={submit} size="lg" className="w-full h-13 rounded-xl gradient-primary shadow-glow text-base font-semibold">
            Continue to data check
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Manual;
