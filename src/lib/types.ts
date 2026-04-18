export type Platform = "TikTok" | "Instagram" | "Facebook" | "WhatsApp" | "Other";

export interface SaleRecord {
  id: string;
  product: string;
  quantity: number;
  price: number;
  date: string; // ISO
  platform: Platform | string;
}

export interface RawRow {
  product?: string;
  quantity?: string | number;
  price?: string | number;
  date?: string;
  platform?: string;
  [key: string]: any;
}

export interface QualityIssue {
  rowIndex: number;
  type: "missing" | "duplicate" | "invalid";
  field: string;
  message: string;
}

export interface QualityReport {
  total: number;
  valid: number;
  missing: number;
  duplicates: number;
  invalid: number;
  issues: QualityIssue[];
  validRows: SaleRecord[];
}
