import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertTriangle, Copy, XCircle, ArrowRight, Wrench } from "lucide-react";
import { storage } from "@/lib/storage";
import { normalizeRow, validateRows } from "@/lib/validation";
import { QualityReport, SaleRecord, RawRow } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

const Quality = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<QualityReport | null>(null);
  const [pendingRaw, setPendingRaw] = useState<RawRow[]>([]);

  useEffect(() => {
    const pending = storage.getPending();
    if (!pending.length) {
      navigate("/");
      return;
    }
    const normalized = pending.map((r: any) =>
      ("product" in r || "quantity" in r) ? r : normalizeRow(r),
    );
    setPendingRaw(normalized);
    const r = validateRows(normalized);
    setReport(r);
    storage.setReport(r);
  }, [navigate]);

  const stats = useMemo(() => {
    if (!report) return [];
    return [
      { label: "Total rows", value: report.total, color: "bg-secondary text-foreground", Icon: null },
      { label: "Valid", value: report.valid, color: "bg-success/10 text-success", Icon: CheckCircle2 },
      { label: "Missing fields", value: report.missing, color: "bg-warning/15 text-warning", Icon: AlertTriangle },
      { label: "Duplicates", value: report.duplicates, color: "bg-accent/15 text-accent-foreground", Icon: Copy },
      { label: "Invalid", value: report.invalid, color: "bg-destructive/10 text-destructive", Icon: XCircle },
    ];
  }, [report]);

  const hasIssues = !!report && report.issues.length > 0;

  const importClean = () => {
    if (!report) return;
    if (!report.valid) {
      toast({ title: "No valid rows to import", description: "Use Continue Anyway to import as-is.", variant: "destructive" });
      return;
    }
    storage.appendSales(report.validRows);
    storage.clearPending();
    storage.setDirty(false);
    toast({ title: "Imported!", description: `${report.valid} sales added to your ledger.` });
    navigate("/dashboard");
  };

  const continueAnyway = () => {
    if (!report) return;
    // Build best-effort records from ALL pending rows, filling sane defaults.
    const all: SaleRecord[] = pendingRaw.map((r, idx) => {
      const qty = Number(r.quantity);
      const price = Number(r.price);
      const parsedDate = r.date ? new Date(r.date) : new Date(NaN);
      const iso = !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date().toISOString();
      return {
        id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        product: (r.product || "Unknown product").toString().trim() || "Unknown product",
        quantity: !isNaN(qty) && qty > 0 ? qty : 0,
        price: !isNaN(price) && price >= 0 ? price : 0,
        date: iso,
        platform: (r.platform || "Other").toString().trim() || "Other",
      };
    });
    storage.appendSales(all);
    storage.clearPending();
    storage.setDirty(true);
    toast({
      title: "Imported with warnings",
      description: `${all.length} rows added. Insights may be affected by incomplete data.`,
    });
    navigate("/dashboard");
  };

  if (!report) return null;

  const healthPct = report.total ? Math.round((report.valid / report.total) * 100) : 0;
  const healthColor = healthPct >= 80 ? "text-success" : healthPct >= 50 ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen bg-background pb-36">
      <AppHeader subtitle="Data Quality Check" />
      <main className="container max-w-2xl py-6 space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <section className="rounded-3xl bg-card border border-border p-6 shadow-soft text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Data quality score</p>
          <p className={`text-6xl font-bold mt-2 ${healthColor}`}>{healthPct}%</p>
          <p className="text-sm text-muted-foreground mt-1">
            {report.valid} of {report.total} rows ready to import
          </p>
        </section>

        {hasIssues && (
          <section className="rounded-2xl border border-warning/40 bg-warning/10 p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Data Quality Issues Detected</h3>
                <ul className="mt-2 space-y-1 text-sm text-foreground/90">
                  {report.missing > 0 && <li>• {report.missing} missing {report.missing === 1 ? "value" : "values"}</li>}
                  {report.duplicates > 0 && <li>• {report.duplicates} duplicate {report.duplicates === 1 ? "entry" : "entries"}</li>}
                  {report.invalid > 0 && <li>• {report.invalid} invalid {report.invalid === 1 ? "value" : "values"}</li>}
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  These issues may affect the accuracy of your insights.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold opacity-80">{s.label}</span>
                {s.Icon && <s.Icon className="w-4 h-4 opacity-70" />}
              </div>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </section>

        {report.issues.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold mb-2 px-1">Issues found ({report.issues.length})</h3>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border max-h-72 overflow-auto">
              {report.issues.slice(0, 50).map((iss, i) => (
                <div key={i} className="p-3 flex items-start gap-3 text-sm">
                  <span
                    className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${
                      iss.type === "missing"
                        ? "bg-warning"
                        : iss.type === "duplicate"
                          ? "bg-accent"
                          : "bg-destructive"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      Row {iss.rowIndex + 1} · {iss.field}
                    </p>
                    <p className="text-xs text-muted-foreground">{iss.message}</p>
                  </div>
                </div>
              ))}
              {report.issues.length > 50 && (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  +{report.issues.length - 50} more issues
                </div>
              )}
            </div>
          </section>
        )}

        {!hasIssues && (
          <div className="rounded-2xl bg-success/10 text-success p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-semibold">No issues found. Your data looks clean!</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4">
        <div className="container max-w-2xl space-y-2">
          {hasIssues ? (
            <>
              <Button
                onClick={continueAnyway}
                size="lg"
                className="w-full h-13 rounded-xl gradient-primary shadow-glow text-base font-semibold"
              >
                Continue Anyway
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full h-12 rounded-xl"
              >
                <Wrench className="w-4 h-4 mr-2" />
                Fix Data
              </Button>
            </>
          ) : (
            <Button
              onClick={importClean}
              disabled={!report.valid}
              size="lg"
              className="w-full h-13 rounded-xl gradient-primary shadow-glow text-base font-semibold"
            >
              Import {report.valid} valid {report.valid === 1 ? "row" : "rows"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quality;
