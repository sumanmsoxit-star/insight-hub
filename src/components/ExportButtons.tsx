import { Download, FileSpreadsheet } from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/export";

interface ExportButtonsProps {
  data: Record<string, any>[];
  filename: string;
  sheetName?: string;
  className?: string;
}

export function ExportButtons({ data, filename, sheetName = "Data", className = "" }: ExportButtonsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => exportToCSV(data, filename)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        title="Export as CSV (Power BI compatible)"
      >
        <Download className="w-3.5 h-3.5" />
        CSV
      </button>
      <button
        onClick={() => exportToExcel(data, filename, sheetName)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors border border-primary/30"
        title="Export as Excel (Power BI compatible)"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Excel
      </button>
    </div>
  );
}
