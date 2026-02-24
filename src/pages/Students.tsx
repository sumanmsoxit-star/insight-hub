import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getStudents, getDepartments, type Student } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { ExportButtons } from "@/components/ExportButtons";

const PAGE_SIZE = 25;

const statusColor = {
  Active: "bg-success/15 text-success border-success/30",
  Graduated: "bg-primary/15 text-primary border-primary/30",
  Dropout: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function Students() {
  const allStudents = useMemo(() => getStudents(), []);
  const departments = getDepartments();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    return allStudents.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || s.departmentId === deptFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [allStudents, search, deptFilter, statusFilter]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const exportData = filtered.map(s => ({
    Student_ID: s.id, Roll_Number: s.rollNumber, Name: s.name, Gender: s.gender, DOB: s.dob,
    Category: s.category, Department: s.departmentId, Semester: s.semester, Section: s.section,
    Status: s.status, Admission_Year: s.admissionYear, CGPA: s.cgpa, Attendance: s.attendancePercent,
    Guardian: s.guardianName, Guardian_Contact: s.guardianContact,
    Fees_Paid: s.feesPaid, Total_Fees: s.totalFees,
  }));

  return (
    <AppLayout title="Student Management" subtitle={`${filtered.length.toLocaleString()} students`}>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID or roll number..." className="pl-9 bg-card border-border" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <Select value={deptFilter} onValueChange={v => { setDeptFilter(v); setPage(0); }}>
          <SelectTrigger className="w-48 bg-card border-border"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-36 bg-card border-border"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Graduated">Graduated</SelectItem>
            <SelectItem value="Dropout">Dropout</SelectItem>
          </SelectContent>
        </Select>
        <ExportButtons data={exportData} filename="students_data" sheetName="Students" />
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 glass-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["ID", "Name", "Dept", "Sem", "CGPA", "Attend.", "Status"].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelected(s)}
                    className={`border-b border-border/50 cursor-pointer transition-colors ${selected?.id === s.id ? "bg-primary/5" : "hover:bg-muted/30"}`}
                  >
                    <td className="py-2 px-3 font-mono text-primary">{s.id}</td>
                    <td className="py-2 px-3 font-medium text-foreground">{s.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{s.departmentId}</td>
                    <td className="py-2 px-3 font-mono">{s.semester}</td>
                    <td className="py-2 px-3 font-mono">{s.cgpa}</td>
                    <td className={`py-2 px-3 font-mono ${s.attendancePercent < 75 ? "text-destructive" : ""}`}>{s.attendancePercent}%</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor[s.status]}`}>{s.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1 rounded text-xs bg-secondary text-secondary-foreground disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-3 py-1 rounded text-xs bg-secondary text-secondary-foreground disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="w-80 glass-card rounded-lg border border-border p-5 h-fit sticky top-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{selected.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">{selected.id} • {selected.rollNumber}</p>
              </div>
            </div>
            <div className="space-y-2.5 text-xs">
              {[
                ["Department", selected.departmentId],
                ["Semester", selected.semester],
                ["Section", selected.section],
                ["Gender", selected.gender],
                ["DOB", selected.dob],
                ["Category", selected.category],
                ["Admission Year", selected.admissionYear],
                ["CGPA", selected.cgpa],
                ["Attendance", `${selected.attendancePercent}%`],
                ["Status", selected.status],
                ["Guardian", selected.guardianName],
                ["Contact", selected.guardianContact],
                ["Fees Paid", `₹${selected.feesPaid.toLocaleString()} / ₹${selected.totalFees.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground font-mono">{value}</span>
                </div>
              ))}
            </div>
            {selected.attendancePercent < 75 && (
              <div className="mt-4 p-2 rounded bg-destructive/10 border border-destructive/30 text-destructive text-[10px] font-medium">
                ⚠ Attendance Defaulter — Below 75% threshold
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
