import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileUp, FileSpreadsheet } from "lucide-react";
import { parseFile } from "@/lib/parseFile";
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-2xl py-6 space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <div>
          <h2 className="text-2xl font-bold">Upload sales file</h2>
          <p className="text-sm text-muted-foreground mt-1">
            CSV or Excel. We'll auto-detect columns: <strong>product, quantity, price, date, platform</strong>.
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
          <p className="font-semibold">Drop your file here</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">or tap to browse</p>
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
