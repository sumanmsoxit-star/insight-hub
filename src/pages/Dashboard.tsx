import { AppLayout } from "@/components/AppLayout";
import { KPICard } from "@/components/KPICard";
import {
  getKPIs,
  getCGPADistribution,
  getPlacementTrend,
  getDepartmentStats,
  getMonthlyAttendance,
  getRevenueTrend,
} from "@/lib/data";
import { exportMultiSheetExcel } from "@/lib/export";
import { ExportButtons } from "@/components/ExportButtons";
import {
  GraduationCap,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Target,
  UserX,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";

const CHART_COLORS = [
  "hsl(187, 72%, 50%)",
  "hsl(152, 60%, 45%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 72%, 55%)",
  "hsl(210, 80%, 55%)",
];

const ChartCard = ({ title, children, className = "", actions }: { title: string; children: React.ReactNode; className?: string; actions?: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`glass-card rounded-lg p-5 border border-border ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {actions}
    </div>
    {children}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card rounded-md px-3 py-2 border border-border text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-mono">
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const kpis = getKPIs();
  const cgpa = getCGPADistribution();
  const placements = getPlacementTrend();
  const deptStats = getDepartmentStats();
  const attendance = getMonthlyAttendance(2026);
  const revenue = getRevenueTrend();

  const deptPie = deptStats.map(d => ({ name: d.id, value: d.students }));

  const deptExport = deptStats.map(d => ({
    Department: d.name, Students: d.students, Faculty: d.faculty,
    Avg_CGPA: d.avgCGPA, Placement_Percent: Math.min(d.placementPercent, 100),
    Avg_Package: d.avgPackage, Attendance: d.attendancePercent,
  }));

  const handleFullExport = () => {
    exportMultiSheetExcel([
      { name: "Department Summary", data: deptExport },
      { name: "CGPA Distribution", data: cgpa },
      { name: "Placement Trend", data: placements },
      { name: "Revenue Trend", data: revenue },
    ], "dashboard_complete_export");
  };

  return (
    <AppLayout title="Institutional Dashboard" subtitle="Real-time analytics for 3000+ students across 4 departments • AY 2025–26">
      {/* Export All */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleFullExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors border border-primary/30"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export All Dashboard Data (Excel)
        </button>
      </div>

      {/* KPI Row */}
      <div className="data-grid mb-6">
        <KPICard title="Total Students" value={kpis.totalStudents.toLocaleString()} subtitle={`${kpis.activeStudents} active`} icon={<GraduationCap className="w-4 h-4" />} variant="primary" trend="up" trendValue="+8.2%" />
        <KPICard title="Faculty" value={kpis.totalFaculty} subtitle={`Ratio ${kpis.studentFacultyRatio}:1`} icon={<Users className="w-4 h-4" />} variant="default" />
        <KPICard title="Avg CGPA" value={kpis.avgCGPA} icon={<BarChart3 className="w-4 h-4" />} variant="success" trend="up" trendValue="+0.15" />
        <KPICard title="Placement Rate" value={`${Math.min(kpis.placementRate, 100)}%`} subtitle={`Avg ₹${kpis.avgPackage} LPA`} icon={<Target className="w-4 h-4" />} variant="primary" trend="up" trendValue="+5%" />
        <KPICard title="Revenue" value={`₹${(kpis.revenueCollected / 10000000).toFixed(1)}Cr`} subtitle={`${kpis.revenuePercent}% collected`} icon={<DollarSign className="w-4 h-4" />} variant="success" trend="up" trendValue="+12%" />
        <KPICard title="Attendance" value={`${kpis.avgAttendance}%`} icon={<BarChart3 className="w-4 h-4" />} variant={kpis.avgAttendance < 75 ? "danger" : "default"} />
        <KPICard title="Defaulters" value={kpis.defaulters} subtitle="Below 75% attendance" icon={<AlertTriangle className="w-4 h-4" />} variant="warning" trend="down" trendValue="-3%" />
        <KPICard title="Dropout Rate" value={`${kpis.dropoutRate}%`} icon={<UserX className="w-4 h-4" />} variant="danger" trend="down" trendValue="-1.2%" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <ChartCard title="CGPA Distribution" actions={<ExportButtons data={cgpa} filename="cgpa_distribution" sheetName="CGPA" />}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cgpa}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="range" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="hsl(187, 72%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Placement Trends (5-Year)" actions={<ExportButtons data={placements} filename="placement_trend" sheetName="Placements" />}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={placements}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "hsl(215, 20%, 55%)" }} />
              <Line yAxisId="left" type="monotone" dataKey="placed" stroke="hsl(187, 72%, 50%)" strokeWidth={2} dot={{ r: 4 }} name="Placed" />
              <Line yAxisId="right" type="monotone" dataKey="avgPackage" stroke="hsl(152, 60%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="Avg Package (LPA)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <ChartCard title="Students by Department">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={deptPie} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {deptPie.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Trend (₹ Cr)" className="lg:col-span-2" actions={<ExportButtons data={revenue} filename="revenue_trend" sheetName="Revenue" />}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickFormatter={v => `${(v / 10000000).toFixed(1)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="collected" stroke="hsl(152, 60%, 45%)" fill="hsl(152, 60%, 45%)" fillOpacity={0.15} name="Collected" />
              <Area type="monotone" dataKey="outstanding" stroke="hsl(38, 92%, 55%)" fill="hsl(38, 92%, 55%)" fillOpacity={0.15} name="Outstanding" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Department Summary Table */}
      <ChartCard title="Department Performance Summary" actions={<ExportButtons data={deptExport} filename="department_summary" sheetName="Departments" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Department</th>
                <th className="text-right py-2 px-3 font-semibold text-muted-foreground">Students</th>
                <th className="text-right py-2 px-3 font-semibold text-muted-foreground">Faculty</th>
                <th className="text-right py-2 px-3 font-semibold text-muted-foreground">Avg CGPA</th>
                <th className="text-right py-2 px-3 font-semibold text-muted-foreground">Placement %</th>
                <th className="text-right py-2 px-3 font-semibold text-muted-foreground">Avg Pkg (LPA)</th>
                <th className="text-right py-2 px-3 font-semibold text-muted-foreground">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map(d => (
                <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">{d.name}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{d.students}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{d.faculty}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{d.avgCGPA}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{Math.min(d.placementPercent, 100)}%</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹{d.avgPackage}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{d.attendancePercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </AppLayout>
  );
}
