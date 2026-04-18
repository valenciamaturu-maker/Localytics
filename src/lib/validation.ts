import { RawRow, SaleRecord, QualityIssue, QualityReport } from "./types";

const normalizeKey = (k: string) => k.toLowerCase().trim().replace(/\s+/g, "_");

export function normalizeRow(row: any): RawRow {
  const out: RawRow = {};
  for (const k of Object.keys(row)) {
    const nk = normalizeKey(k);
    if (nk.includes("product") || nk.includes("item") || nk.includes("name")) out.product = String(row[k] ?? "").trim();
    else if (nk.includes("qty") || nk.includes("quantity")) out.quantity = row[k];
    else if (nk.includes("price") || nk.includes("amount") || nk.includes("revenue")) out.price = row[k];
    else if (nk.includes("date")) out.date = String(row[k] ?? "").trim();
    else if (nk.includes("platform") || nk.includes("channel") || nk.includes("source")) out.platform = String(row[k] ?? "").trim();
  }
  return out;
}

function parseDate(v?: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d.toISOString();
  // try dd/mm/yyyy
  const m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const [_, dd, mm, yy] = m;
    const yyyy = yy.length === 2 ? `20${yy}` : yy;
    const d2 = new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
    if (!isNaN(d2.getTime())) return d2.toISOString();
  }
  return null;
}

export function validateRows(rows: RawRow[]): QualityReport {
  const issues: QualityIssue[] = [];
  const validRows: SaleRecord[] = [];
  const seen = new Set<string>();
  let missing = 0,
    duplicates = 0,
    invalid = 0;

  rows.forEach((r, idx) => {
    const rowIssues: QualityIssue[] = [];

    if (!r.product) rowIssues.push({ rowIndex: idx, type: "missing", field: "product", message: "Missing product name" });

    const qty = Number(r.quantity);
    if (r.quantity === undefined || r.quantity === "" || isNaN(qty)) {
      rowIssues.push({ rowIndex: idx, type: "missing", field: "quantity", message: "Missing or invalid quantity" });
    } else if (qty <= 0) {
      rowIssues.push({ rowIndex: idx, type: "invalid", field: "quantity", message: "Quantity must be > 0" });
    }

    const price = Number(r.price);
    if (r.price === undefined || r.price === "" || isNaN(price)) {
      rowIssues.push({ rowIndex: idx, type: "missing", field: "price", message: "Missing or invalid price" });
    } else if (price < 0) {
      rowIssues.push({ rowIndex: idx, type: "invalid", field: "price", message: "Price cannot be negative" });
    }

    const iso = parseDate(r.date);
    if (!r.date) rowIssues.push({ rowIndex: idx, type: "missing", field: "date", message: "Missing date" });
    else if (!iso) rowIssues.push({ rowIndex: idx, type: "invalid", field: "date", message: "Invalid date format" });

    const platform = (r.platform || "Other").trim() || "Other";

    const key = `${(r.product || "").toLowerCase()}|${iso || r.date}|${qty}|${price}|${platform.toLowerCase()}`;
    const isDup = seen.has(key);
    if (isDup) {
      duplicates++;
      rowIssues.push({ rowIndex: idx, type: "duplicate", field: "row", message: "Duplicate row" });
    } else {
      seen.add(key);
    }

    const hasMissing = rowIssues.some((i) => i.type === "missing");
    const hasInvalid = rowIssues.some((i) => i.type === "invalid");
    if (hasMissing) missing++;
    if (hasInvalid) invalid++;

    issues.push(...rowIssues);

    if (rowIssues.length === 0 && r.product && iso) {
      validRows.push({
        id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        product: r.product.trim(),
        quantity: qty,
        price: price,
        date: iso,
        platform,
      });
    }
  });

  return {
    total: rows.length,
    valid: validRows.length,
    missing,
    duplicates,
    invalid,
    issues,
    validRows,
  };
}
