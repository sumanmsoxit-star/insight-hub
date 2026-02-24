import { AppLayout } from "@/components/AppLayout";
import { getMonthlyAttendance, getStudents, getDepartments } from "@/lib/data";
import { KPICard } from "@/components/KPICard";
import { Calendar, AlertTriangle, Users, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { ExportButtons } from "@/components/ExportButtons";

const DEPT_COLORS: Record<string, string> = {
  CSE: "hsl(187,72%,50%)",
  ECE: "hsl(152,60%,45%)",
  ME: "hsl(38,92%,55%)",
  CE: "hsl(280,65%,60%)",
};

export default function Attendance() {
  const monthlyData = getMonthlyAttendance(2026);
  const students = useMemo(() => getStudents().filter(s => s.status === "Active"), []);
  const defaulters = students.filter(s => s.attendancePercent < 75);
  const departments = getDepartments();

  const defaulterExport = defaulters.map(s => ({
    Student_ID: s.id, Name: s.name, Department: s.departmentId, Semester: s.semester,
    Attendance_Percent: s.attendancePercent, CGPA: s.cgpa, Status: s.status,
  }));

  const monthlyExport = monthlyData.map(m => ({ Month: m.month, ...Object.fromEntries(departments.map(d => [d.name, (m as any)[d.id]])) }));

  return (
    <AppLayout title="Attendance Analytics" subtitle="Monthly tracking and defaulter detection">
      <div className="data-grid mb-6">
        <KPICard title="Avg Attendance" value={`${(students.reduce((a, s) => a + s.attendancePercent, 0) / students.length).toFixed(1)}%`} icon={<Calendar className="w-4 h-4" />} variant="primary" />
        <KPICard title="Defaulters (<75%)" value={defaulters.length} subtitle={`${((defaulters.length / students.length) * 100).toFixed(1)}% of active`} icon={<AlertTriangle className="w-4 h-4" />} variant="warning" />
        <KPICard title="Active Students" value={students.length} icon={<Users className="w-4 h-4" />} variant="default" />
        <KPICard title="At-Risk Students" value={students.filter(s => s.attendancePercent < 65).length} subtitle="Below 65%" icon={<BarChart3 className="w-4 h-4" />} variant="danger" />
      </div>

      <div className="glass-card rounded-lg border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Monthly Attendance by Department (2026)</h3>
          <ExportButtons data={monthlyExport} filename="monthly_attendance" sheetName="Monthly" />
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
            <YAxis domain={[60, 100]} tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {departments.map(d => (
              <Line key={d.id} type="monotone" dataKey={d.id} stroke={DEPT_COLORS[d.id]} strokeWidth={2} name={d.name} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Attendance Defaulters ({defaulters.length} students below 75%)</h3>
          <ExportButtons data={defaulterExport} filename="attendance_defaulters" sheetName="Defaulters" />
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border">
                {["ID", "Name", "Department", "Semester", "Attendance %", "CGPA"].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defaulters.slice(0, 50).map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2 px-3 font-mono text-primary">{s.id}</td>
                  <td className="py-2 px-3 font-medium text-foreground">{s.name}</td>
                  <td className="py-2 px-3 text-muted-foreground">{s.departmentId}</td>
                  <td className="py-2 px-3 font-mono">{s.semester}</td>
                  <td className="py-2 px-3 font-mono text-destructive font-semibold">{s.attendancePercent}%</td>
                  <td className="py-2 px-3 font-mono">{s.cgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
