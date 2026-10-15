export const MAX_ROWS = 2000;

/** Detects `;` or `,` separator and parses quoted CSV. */
export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const first = clean.split(/\r?\n/, 1)[0] ?? "";
  const sep = (first.match(/;/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (q) {
      if (c === '"' && clean[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === sep) { row.push(cell.trim()); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && clean[i + 1] === "\n") i++;
      row.push(cell.trim()); cell = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      if (rows.length > MAX_ROWS) break;
    } else cell += c;
  }
  row.push(cell.trim());
  if (row.some((v) => v !== "") && rows.length <= MAX_ROWS) rows.push(row);
  return rows.slice(0, MAX_ROWS + 1);
}

/** "R$ 1.234,56" -> 1234.56 ; "1,234.56" -> 1234.56 ; returns null if not numeric. */
export function parseBrNumber(v: string): number | null {
  let s = v.replace(/[R$\s%]/g, "");
  if (!/^-?[\d.,]+$/.test(s)) return null;
  const lc = s.lastIndexOf(","), ld = s.lastIndexOf(".");
  if (lc > ld) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Normalizes rows to a compact CSV (`;`, decimals with `.`) for the AI. */
export function toCompactCsv(rows: string[][]): string {
  return rows
    .map((r, i) => r.map((c) => (i > 0 ? (parseBrNumber(c)?.toString() ?? c) : c).replace(/;/g, ",")).join(";"))
    .join("\n");
}
