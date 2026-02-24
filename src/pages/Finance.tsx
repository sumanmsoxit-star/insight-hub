import { AppLayout } from "@/components/AppLayout";
import { getKPIs, getRevenueTrend, getStudents } from "@/lib/data";
import { KPICard } from "@/components/KPICard";
import { DollarSign, TrendingUp, Award } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { useMemo } from "react";
import { ExportButtons } from "@/components/ExportButtons";

export default function Finance() {
  const kpis = getKPIs();
  const revenue = getRevenueTrend();
  const students = useMemo(() => getStudents(), []);

  const feeDistribution = useMemo(() => {
    const ranges = [
      { label: "Fully Paid", min: 0.95 },
      { label: "75-95%", min: 0.75 },
      { label: "50-75%", min: 0.5 },
      { label: "< 50%", min: 0 },
    ];
    return ranges.map(r => ({
      range: r.label,
      count: students.filter(s => {
        const ratio = s.feesPaid / s.totalFees;
        if (r.label === "Fully Paid") return ratio >= 0.95;
        if (r.label === "75-95%") return ratio >= 0.75 && ratio < 0.95;
        if (r.label === "50-75%") return ratio >= 0.5 && ratio < 0.75;
        return ratio < 0.5;
      }).length,
    }));
  }, [students]);

  const feeExport = students.map(s => ({
    Student_ID: s.id, Name: s.name, Department: s.departmentId, Total_Fees: s.totalFees,
    Fees_Paid: s.feesPaid, Outstanding: s.totalFees - s.feesPaid,
    Payment_Percent: `${((s.feesPaid / s.totalFees) * 100).toFixed(1)}%`,
  }));

  const revenueExport = revenue.map(r => ({
    Year: r.year, Collected: r.collected, Outstanding: r.outstanding,
  }));

  return (
    <AppLayout title="Financial Analytics" subtitle="Revenue tracking, fee management, and scholarship analytics">
      <div className="data-grid mb-6">
        <KPICard title="Total Revenue" value={`₹${(kpis.revenueCollected / 10000000).toFixed(1)}Cr`} icon={<DollarSign className="w-4 h-4" />} variant="success" trend="up" trendValue="+12%" />
        <KPICard title="Collection Rate" value={`${kpis.revenuePercent}%`} icon={<TrendingUp className="w-4 h-4" />} variant="primary" />
        <KPICard title="Outstanding" value={`₹${((students.reduce((a, s) => a + s.totalFees - s.feesPaid, 0)) / 10000000).toFixed(1)}Cr`} icon={<DollarSign className="w-4 h-4" />} variant="warning" />
        <KPICard title="Scholarships" value={kpis.scholarshipStudents} subtitle="~12% of active students" icon={<Award className="w-4 h-4" />} variant="default" />
      </div>

      <div className="flex justify-end mb-4">
        <ExportButtons data={feeExport} filename="financial_data" sheetName="Fees" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Trend (5-Year)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickFormatter={v => `₹${(v / 10000000).toFixed(0)}Cr`} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="collected" stroke="hsl(152,60%,45%)" fill="hsl(152,60%,45%)" fillOpacity={0.2} name="Collected" />
              <Area type="monotone" dataKey="outstanding" stroke="hsl(38,92%,55%)" fill="hsl(38,92%,55%)" fillOpacity={0.2} name="Outstanding" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Fee Payment Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={feeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="range" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(187,72%,50%)" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
