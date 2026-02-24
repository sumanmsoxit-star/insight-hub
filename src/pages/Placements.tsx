import { AppLayout } from "@/components/AppLayout";
import { getPlacementTrend, getPlacements, getCompanies } from "@/lib/data";
import { KPICard } from "@/components/KPICard";
import { Briefcase, TrendingUp, Building2, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";
import { ExportButtons } from "@/components/ExportButtons";

const COLORS = ["hsl(187,72%,50%)", "hsl(152,60%,45%)", "hsl(38,92%,55%)", "hsl(280,65%,60%)", "hsl(0,72%,55%)", "hsl(210,80%,55%)", "hsl(320,70%,55%)", "hsl(160,50%,50%)", "hsl(45,80%,50%)", "hsl(200,60%,50%)", "hsl(260,55%,55%)", "hsl(10,65%,50%)"];

export default function Placements() {
  const trend = getPlacementTrend();
  const placements = useMemo(() => getPlacements(), []);
  const current = placements.filter(p => p.year === 2026);

  const companyDist = useMemo(() => {
    const counts: Record<string, number> = {};
    current.forEach(p => { counts[p.companyName] = (counts[p.companyName] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));
  }, [current]);

  const coreVsNon = [
    { name: "Core", value: current.filter(p => p.isCore).length },
    { name: "Non-Core", value: current.filter(p => !p.isCore).length },
  ];

  const placementExport = placements.map(p => ({
    Student_ID: p.studentId, Student_Name: p.studentName, Department: p.departmentId,
    Company: p.companyName, Package_LPA: p.packageLPA, Year: p.year,
    Core_Placement: p.isCore ? "Yes" : "No", Higher_Studies: p.higherStudies ? "Yes" : "No",
  }));

  return (
    <AppLayout title="Placement Analytics" subtitle="5-year placement trends and company distribution">
      <div className="data-grid mb-6">
        <KPICard title="Total Placed (2026)" value={current.length} icon={<Briefcase className="w-4 h-4" />} variant="primary" />
        <KPICard title="Avg Package" value={`₹${(current.reduce((a, p) => a + p.packageLPA, 0) / (current.length || 1)).toFixed(1)} LPA`} icon={<TrendingUp className="w-4 h-4" />} variant="success" trend="up" trendValue="+8%" />
        <KPICard title="Highest Package" value={`₹${Math.max(...current.map(p => p.packageLPA)).toFixed(1)} LPA`} icon={<Target className="w-4 h-4" />} variant="primary" />
        <KPICard title="Companies" value={new Set(current.map(p => p.companyName)).size} icon={<Building2 className="w-4 h-4" />} variant="default" />
      </div>

      <div className="flex justify-end mb-4">
        <ExportButtons data={placementExport} filename="placement_data" sheetName="Placements" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">5-Year Placement Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="placed" stroke="hsl(187,72%,50%)" strokeWidth={2} name="Students Placed" />
              <Line type="monotone" dataKey="highestPackage" stroke="hsl(152,60%,45%)" strokeWidth={2} name="Highest Pkg (LPA)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Recruiting Companies</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={companyDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis type="number" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(187,72%,50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Core vs Non-Core</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={coreVsNon} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                <Cell fill="hsl(187,72%,50%)" />
                <Cell fill="hsl(38,92%,55%)" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-lg border border-border p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Avg CTC Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avgPackage" fill="hsl(152,60%,45%)" radius={[4, 4, 0, 0]} name="Avg Package (LPA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
