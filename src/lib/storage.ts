import { SaleRecord, QualityReport } from "./types";

const SALES_KEY = "ghostledger.sales.v1";
const REPORT_KEY = "ghostledger.report.v1";
const PENDING_KEY = "ghostledger.pending.v1";

export const storage = {
  getSales(): SaleRecord[] {
    try {
      return JSON.parse(localStorage.getItem(SALES_KEY) || "[]");
    } catch {
      return [];
    }
  },
  setSales(rows: SaleRecord[]) {
    localStorage.setItem(SALES_KEY, JSON.stringify(rows));
  },
  appendSales(rows: SaleRecord[]) {
    const cur = storage.getSales();
    storage.setSales([...cur, ...rows]);
  },
  clearSales() {
    localStorage.removeItem(SALES_KEY);
  },
  setPending(rows: any[]) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(rows));
  },
  getPending(): any[] {
    try {
      return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
    } catch {
      return [];
    }
  },
  clearPending() {
    localStorage.removeItem(PENDING_KEY);
  },
  setReport(r: QualityReport) {
    localStorage.setItem(REPORT_KEY, JSON.stringify(r));
  },
  getReport(): QualityReport | null {
    try {
      const v = localStorage.getItem(REPORT_KEY);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
};
