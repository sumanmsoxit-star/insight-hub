import { AppLayout } from "@/components/AppLayout";
import { getDepartmentStats } from "@/lib/data";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { ExportButtons } from "@/components/ExportButtons";

export default function Departments() {
  const stats = getDepartmentStats();

  const radarData = stats.map(d => ({
    department: d.id,
    "CGPA (×10)": d.avgCGPA * 10,
    "Placement %": Math.min(d.placementPercent, 100),
    "Attendance %": d.attendancePercent,
    "Avg Pkg (×5)": d.avgPackage * 5,
  }));

  const exportData = stats.map(d => ({
    Department_ID: d.id, Department_Name: d.name, Students: d.students, Faculty: d.faculty,
    Avg_CGPA: d.avgCGPA, Placement_Percent: Math.min(d.placementPercent, 100),
    Avg_Package_LPA: d.avgPackage, Attendance_Percent: d.attendancePercent,
    Revenue: d.revenue,
  }));

  return (
    <AppLayout title="Departments" subtitle="Comparative performance across 4 departments">
      <div className="flex justify-end mb-4">
        <ExportButtons data={exportData} filename="department_stats" sheetName="Departments" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-bold text-foreground mb-1">{d.name}</h3>
            <p className="text-[10px] text-muted-foreground mb-4">{d.id}</p>
            <div className="space-y-2 text-xs">
              {[
                ["Students", d.students],
                ["Faculty", d.faculty],
                ["Avg CGPA", d.avgCGPA],
                ["Placement", `${Math.min(d.placementPercent, 100)}%`],
                ["Avg Package", `₹${d.avgPackage} LPA`],
                ["Attendance", `${d.attendancePercent}%`],
                ["Revenue", `₹${(d.revenue / 10000000).toFixed(1)}Cr`],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-mono font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Students by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="id" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="students" fill="hsl(187, 72%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222, 30%, 16%)" />
              <PolarAngleAxis dataKey="department" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 9 }} />
              <Radar name="CGPA" dataKey="CGPA (×10)" stroke="hsl(187, 72%, 50%)" fill="hsl(187, 72%, 50%)" fillOpacity={0.2} />
              <Radar name="Placement" dataKey="Placement %" stroke="hsl(152, 60%, 45%)" fill="hsl(152, 60%, 45%)" fillOpacity={0.2} />
              <Radar name="Attendance" dataKey="Attendance %" stroke="hsl(38, 92%, 55%)" fill="hsl(38, 92%, 55%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
