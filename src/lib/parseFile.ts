import Papa from "papaparse";
import * as XLSX from "xlsx";
import { normalizeRow } from "./validation";
import { RawRow } from "./types";

export async function parseFile(file: File): Promise<RawRow[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv") || file.type === "text/csv") {
    return new Promise((resolve, reject) => {
      Papa.parse<any>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => resolve(res.data.map(normalizeRow)),
        error: reject,
      });
    });
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });
    return json.map(normalizeRow);
  }
  throw new Error("Unsupported file. Please upload .csv, .xlsx or .xls");
}
