"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  FileText,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type ImportStatus = "idle" | "parsing" | "preview" | "importing" | "done" | "error";

interface CsvRow {
  title: string;
  type: string;
  location: string;
  price?: string;
  description?: string;
  status?: string;
  images?: string;
  featured?: string;
  _valid: boolean;
  _errors: string[];
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const TEMPLATE_HEADERS =
  "title,type,location,price,description,status,images,featured";

const TEMPLATE_EXAMPLE = [
  TEMPLATE_HEADERS,
  "4-Bedroom House East Legon,residential,East Legon Accra,GHS 950000,Spacious 4-bed house with pool and modern finishes,available,https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600,false",
  "Prime Land Airport Residential,land,Airport Residential Accra,GHS 2500000,500 sqm prime land in gated community,available,,false",
  "Modern Office Space Osu,commercial,Osu Accra,GHS 15000/month,600 sqm open-plan office — 2nd floor,available,,false",
].join("\n");

const VALID_TYPES = ["residential", "commercial", "land"];
const VALID_STATUSES = ["available", "sold", "rented"];

function parseCSV(text: string): CsvRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().trim();
  const expectedHeaders = ["title", "type", "location"];
  for (const h of expectedHeaders) {
    if (!header.includes(h)) {
      throw new Error(`Missing required column: "${h}"`);
    }
  }

  const cols = header.split(",").map((c) => c.trim());
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') {
        inQuotes = !inQuotes;
      } else if (line[j] === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += line[j];
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    cols.forEach((col, idx) => {
      row[col] = values[idx] || "";
    });

    const errors: string[] = [];
    if (!row.title) errors.push("Title is required");
    if (!row.type) errors.push("Type is required");
    if (!row.location) errors.push("Location is required");
    if (row.type && !VALID_TYPES.includes(row.type.toLowerCase())) {
      errors.push(`Type must be: ${VALID_TYPES.join(", ")}`);
    }
    if (row.status && !VALID_STATUSES.includes(row.status.toLowerCase())) {
      errors.push(`Status must be: ${VALID_STATUSES.join(", ")}`);
    }

    rows.push({
      title: row.title || "",
      type: row.type?.toLowerCase() || "residential",
      location: row.location || "",
      price: row.price || "",
      description: row.description || "",
      status: row.status?.toLowerCase() || "available",
      images: row.images || "",
      featured: row.featured || "false",
      _valid: errors.length === 0,
      _errors: errors,
    });
  }

  return rows;
}

export default function ImportPropertiesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_EXAMPLE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mg-reliance-properties-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("parsing");
    setGlobalError(null);
    setRows([]);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        throw new Error("No data rows found in the CSV file.");
      }
      setRows(parsed);
      setStatus("preview");
    } catch (err: unknown) {
      setGlobalError(err instanceof Error ? err.message : "Failed to parse CSV file.");
      setStatus("error");
    }

    e.target.value = "";
  };

  const handleImport = async () => {
    const validRows = rows.filter((r) => r._valid);
    if (validRows.length === 0) return;

    setStatus("importing");
    const supabase = createClient();
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of validRows) {
      const images = row.images
        ? row.images.split("|").map((u) => u.trim()).filter(Boolean)
        : [];

      const { error } = await supabase.from("properties").insert([{
        title: row.title.trim(),
        type: row.type,
        location: row.location.trim(),
        price: row.price?.trim() || null,
        description: row.description?.trim() || null,
        status: row.status || "available",
        images,
        featured: row.featured === "true",
      }]);

      if (error) {
        failed++;
        errors.push(`"${row.title}": ${error.message}`);
      } else {
        success++;
      }
    }

    setResult({ success, failed, errors });
    setStatus("done");
  };

  const reset = () => {
    setStatus("idle");
    setRows([]);
    setFileName("");
    setResult(null);
    setGlobalError(null);
  };

  const validCount = rows.filter((r) => r._valid).length;
  const invalidCount = rows.filter((r) => !r._valid).length;

  return (
    <>
      <AdminHeader
        title="Bulk Import Properties"
        description="Upload a CSV file to add multiple properties at once."
        action={
          <Link
            href="/admin/dashboard/properties"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-main transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Properties
          </Link>
        }
      />

      {/* Template Download */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-main text-sm mb-1">
                Start with the template
              </h3>
              <p className="text-text-secondary text-xs leading-relaxed max-w-lg">
                Download the CSV template with example data. Fill it in with your
                properties — one row per property. For multiple images on one
                property, separate URLs with a pipe character{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">|</code>.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-secondary">
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">title*</span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">type* (residential/commercial/land)</span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">location*</span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">price</span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">description</span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">status (available/sold/rented)</span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">images (pipe-separated)</span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">featured (true/false)</span>
              </div>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shrink-0"
          >
            <Download size={15} />
            Download Template
          </button>
        </div>
      </div>

      {/* Done State */}
      {status === "done" && result && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-text-main mb-2">
            Import Complete
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            <span className="text-green-600 font-semibold">{result.success} properties</span> imported
            successfully
            {result.failed > 0 && (
              <>, <span className="text-red-500 font-semibold">{result.failed} failed</span></>
            )}.
          </p>
          {result.errors.length > 0 && (
            <div className="text-left bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-xs text-red-700 space-y-1 max-h-40 overflow-y-auto">
              {result.errors.map((err, i) => <p key={i}>{err}</p>)}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { router.push("/admin/dashboard/properties"); router.refresh(); }}
              className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
            >
              View Properties
            </button>
            <button
              onClick={reset}
              className="text-sm text-text-secondary hover:text-text-main transition-colors px-4"
            >
              Import Another File
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {(status === "idle" || status === "error") && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {globalError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-5">
              <AlertCircle size={16} className="shrink-0" />
              {globalError}
            </div>
          )}
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:border-primary hover:bg-primary/5 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv,text/csv"
              onChange={handleFileChange}
            />
            <Upload size={32} className="text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-text-main">
              Click to upload your CSV file
            </p>
            <p className="text-xs text-text-secondary mt-1">Only .csv files accepted</p>
          </label>
        </div>
      )}

      {/* Parsing */}
      {status === "parsing" && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Parsing {fileName}…</p>
        </div>
      )}

      {/* Preview */}
      {status === "preview" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Summary bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-text-main">
                {rows.length} rows found in <span className="text-primary">{fileName}</span>
              </span>
              <Badge variant="success">{validCount} valid</Badge>
              {invalidCount > 0 && (
                <Badge variant="danger">{invalidCount} with errors</Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-main transition-colors"
              >
                <X size={13} /> Change file
              </button>
              <Button
                onClick={handleImport}
                variant="primary"
                size="sm"
                disabled={validCount === 0}
              >
                Import {validCount} {validCount === 1 ? "Property" : "Properties"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider w-8">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Valid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={row._valid ? "hover:bg-gray-50" : "bg-red-50 hover:bg-red-50"}
                  >
                    <td className="px-4 py-3 text-xs text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-text-main max-w-[200px] truncate">
                      {row.title || <span className="text-red-400 italic">missing</span>}
                    </td>
                    <td className="px-4 py-3">
                      {row.type ? (
                        <Badge variant={VALID_TYPES.includes(row.type) ? "neutral" : "danger"}>
                          {row.type}
                        </Badge>
                      ) : (
                        <span className="text-red-400 text-xs italic">missing</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary max-w-[160px] truncate">
                      {row.location || <span className="text-red-400 italic">missing</span>}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{row.price || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.status === "available" ? "success" : row.status === "sold" ? "danger" : "warning"}>
                        {row.status || "available"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {row._valid ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <div className="flex items-start gap-1.5">
                          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-red-600">{row._errors.join(", ")}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Importing */}
      {status === "importing" && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Importing {validCount} properties…</p>
          <p className="text-text-secondary text-xs mt-1">Please wait, do not close this tab.</p>
        </div>
      )}
    </>
  );
}
