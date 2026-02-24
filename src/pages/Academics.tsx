import { AppLayout } from "@/components/AppLayout";
import { getCGPADistribution, getStudents, getDepartmentStats } from "@/lib/data";
import { KPICard } from "@/components/KPICard";
import { BarChart3, Award, AlertTriangle, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { ExportButtons } from "@/components/ExportButtons";

export default function Academics() {
  const cgpaData = getCGPADistribution();
  const students = useMemo(() => getStudents().filter(s => s.status === "Active"), []);
  const deptStats = getDepartmentStats();

  const topPerformers = useMemo(() =>
    [...students].sort((a, b) => b.cgpa - a.cgpa).slice(0, 10),
  [students]);

  const deptCGPA = deptStats.map(d => ({ name: d.id, avgCGPA: d.avgCGPA }));

  const topExport = topPerformers.map((s, i) => ({
    Rank: i + 1, Student_ID: s.id, Name: s.name, Department: s.departmentId,
    Semester: s.semester, CGPA: s.cgpa, Attendance: s.attendancePercent,
  }));

  const allAcademicExport = students.map(s => ({
    Student_ID: s.id, Name: s.name, Department: s.departmentId, Semester: s.semester,
    CGPA: s.cgpa, Attendance: s.attendancePercent, Status: s.status,
  }));

  return (
    <AppLayout title="Academic Performance" subtitle="CGPA analytics, top performers, and department comparison">
      <div className="data-grid mb-6">
        <KPICard title="Avg CGPA" value={(students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2)} icon={<BarChart3 className="w-4 h-4" />} variant="primary" />
        <KPICard title="Top CGPA" value={Math.max(...students.map(s => s.cgpa)).toFixed(2)} icon={<Award className="w-4 h-4" />} variant="success" />
        <KPICard title="Below 5.0" value={students.filter(s => s.cgpa < 5).length} icon={<AlertTriangle className="w-4 h-4" />} variant="danger" />
        <KPICard title="Above 8.0" value={students.filter(s => s.cgpa >= 8).length} icon={<BookOpen className="w-4 h-4" />} variant="success" />
      </div>

      <div className="flex justify-end mb-4">
        <ExportButtons data={allAcademicExport} filename="academic_performance" sheetName="Academics" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">CGPA Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cgpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="range" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(187,72%,50%)" radius={[4,4,0,0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Avg CGPA by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptCGPA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <YAxis domain={[0, 10]} tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avgCGPA" fill="hsl(152,60%,45%)" radius={[4,4,0,0]} name="Avg CGPA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Top 10 Performers</h3>
          <ExportButtons data={topExport} filename="top_performers" sheetName="TopPerformers" />
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Rank", "ID", "Name", "Department", "Semester", "CGPA", "Attendance"].map(h => (
                <th key={h} className="text-left py-2 px-3 font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topPerformers.map((s, i) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-2 px-3 font-mono font-bold text-warning">#{i + 1}</td>
                <td className="py-2 px-3 font-mono text-primary">{s.id}</td>
                <td className="py-2 px-3 font-medium text-foreground">{s.name}</td>
                <td className="py-2 px-3 text-muted-foreground">{s.departmentId}</td>
                <td className="py-2 px-3 font-mono">{s.semester}</td>
                <td className="py-2 px-3 font-mono text-success font-bold">{s.cgpa}</td>
                <td className="py-2 px-3 font-mono">{s.attendancePercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
