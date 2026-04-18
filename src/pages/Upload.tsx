import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileUp, FileSpreadsheet, ClipboardPaste } from "lucide-react";
import Papa from "papaparse";
import { parseFile } from "@/lib/parseFile";
import { normalizeRow } from "@/lib/validation";
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pasted, setPasted] = useState("");

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const rows = await parseFile(file);
      if (!rows.length) throw new Error("No rows found in file");
      storage.setPending(rows);
      toast({ title: "File parsed", description: `${rows.length} rows ready to validate.` });
      navigate("/quality");
    } catch (e: any) {
      toast({ title: "Couldn't read file", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePastedImport = () => {
    const text = pasted.trim();
    if (!text) {
      toast({ title: "Nothing to import", description: "Paste your data first.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Auto-detect delimiter (CSV, TSV, semicolon)
      const res = Papa.parse<any>(text, {
        header: true,
        skipEmptyLines: true,
        delimitersToGuess: [",", "\t", ";", "|"],
      });
      const rows = (res.data || []).map(normalizeRow);
      if (!rows.length) throw new Error("No rows detected. Include a header row.");
      storage.setPending(rows);
      toast({ title: "Data imported", description: `${rows.length} rows ready to validate.` });
      navigate("/quality");
    } catch (e: any) {
      toast({ title: "Couldn't parse data", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-2xl py-6 space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <div>
          <h2 className="text-2xl font-bold">Import sales data</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a file or paste rows directly. Columns: <strong>product, quantity, price, date, platform</strong>.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`rounded-3xl border-2 border-dashed p-10 text-center transition-smooth ${
            dragOver ? "border-primary bg-primary/5" : "border-border bg-card"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-glow mb-4">
            <FileUp className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="font-semibold">Import CSV or Excel</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Drop a file or tap to browse</p>
          <Button
            size="lg"
            className="rounded-xl h-12 px-6"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            {loading ? "Reading…" : "Choose file"}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent-foreground flex items-center justify-center shrink-0">
              <ClipboardPaste className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Paste a dataset</p>
              <p className="text-xs text-muted-foreground">
                Copy rows from Excel, Google Sheets, or any CSV.
              </p>
            </div>
          </div>
          <Textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder={"product,quantity,price,date,platform\nAnkara Dress,3,2500,2025-03-01,TikTok"}
            className="font-mono text-xs min-h-[140px] rounded-xl"
          />
          <Button
            onClick={handlePastedImport}
            disabled={loading || !pasted.trim()}
            className="w-full rounded-xl h-12"
          >
            {loading ? "Importing…" : "Import pasted data"}
          </Button>
        </div>

        <div className="rounded-2xl bg-secondary/60 p-4 flex gap-3">
          <FileSpreadsheet className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Example columns</p>
            <code className="block bg-background rounded-lg p-2 text-[11px] font-mono">
              product, quantity, price, date, platform
            </code>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
