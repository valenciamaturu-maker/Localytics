import { Link } from "react-router-dom";
import { Ghost, WifiOff } from "lucide-react";

export const AppHeader = ({ subtitle }: { subtitle?: string }) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container max-w-2xl flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-smooth">
            <Ghost className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none">Localytics</h1>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
          <WifiOff className="w-3 h-3" />
          Offline-ready
        </div>
      </div>
    </header>
  );
};
