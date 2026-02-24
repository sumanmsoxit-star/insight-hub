import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getFaculty, getDepartments } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { ExportButtons } from "@/components/ExportButtons";

export default function Faculty() {
  const allFaculty = useMemo(() => getFaculty(), []);
  const departments = getDepartments();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = useMemo(() => {
    return allFaculty.filter(f => {
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || f.departmentId === deptFilter;
      return matchSearch && matchDept;
    });
  }, [allFaculty, search, deptFilter]);

  const exportData = filtered.map(f => ({
    Faculty_ID: f.id, Name: f.name, Qualification: f.qualification, Experience_Years: f.experience,
    Department: f.departmentId, Designation: f.designation, Email: f.email, Phone: f.phone, Publications: f.publications,
  }));

  return (
    <AppLayout title="Faculty Management" subtitle={`${filtered.length} faculty members`}>
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search faculty..." className="pl-9 bg-card border-border" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-48 bg-card border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <ExportButtons data={exportData} filename="faculty_data" sheetName="Faculty" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card rounded-lg border border-border p-4 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {f.name.replace("Dr. ", "").charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{f.name}</h3>
                <p className="text-[10px] text-muted-foreground">{f.designation} • {f.departmentId}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-muted-foreground">Qualification</span><p className="font-medium text-foreground">{f.qualification}</p></div>
              <div><span className="text-muted-foreground">Experience</span><p className="font-medium text-foreground font-mono">{f.experience} yrs</p></div>
              <div><span className="text-muted-foreground">Publications</span><p className="font-medium text-foreground font-mono">{f.publications}</p></div>
              <div><span className="text-muted-foreground">Email</span><p className="font-medium text-foreground truncate">{f.email}</p></div>
            </div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
