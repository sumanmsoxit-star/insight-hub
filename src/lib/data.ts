// Synthetic data engine for 3000-student institutional system

const DEPARTMENTS = [
  { id: "CSE", name: "Computer Science & Engineering", hod: "Dr. Rajesh Kumar", established: 2005 },
  { id: "ECE", name: "Electronics & Communication", hod: "Dr. Priya Sharma", established: 2006 },
  { id: "ME", name: "Mechanical Engineering", hod: "Dr. Suresh Patel", established: 2004 },
  { id: "CE", name: "Civil Engineering", hod: "Dr. Anita Verma", established: 2007 },
];

const FIRST_NAMES = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Ayaan","Krishna","Ishaan","Ananya","Diya","Myra","Sara","Aanya","Aadhya","Ira","Anika","Priya","Riya","Neha","Pooja","Rahul","Amit","Vijay","Kiran","Meera","Kavita","Rohan","Tanvi","Sneha","Manish","Deepak","Ritika","Nisha","Sameer","Ajay","Simran","Harsha","Pallavi","Gaurav","Ankita","Kunal","Shruti","Nikhil","Varun","Swati","Divya","Mohit","Preeti"];
const LAST_NAMES = ["Sharma","Verma","Patel","Kumar","Singh","Reddy","Nair","Gupta","Joshi","Malhotra","Chatterjee","Banerjee","Das","Mukherjee","Iyer","Menon","Rao","Pillai","Deshmukh","Kulkarni","Patil","Jain","Agarwal","Mehta","Shah","Bose","Ghosh","Sen","Mishra","Pandey"];

const SUBJECTS: Record<string, { id: string; name: string; credits: number; semester: number }[]> = {
  CSE: [
    { id: "CS101", name: "Data Structures", credits: 4, semester: 3 },
    { id: "CS102", name: "Algorithms", credits: 4, semester: 4 },
    { id: "CS103", name: "Database Systems", credits: 3, semester: 5 },
    { id: "CS104", name: "Operating Systems", credits: 4, semester: 4 },
    { id: "CS105", name: "Computer Networks", credits: 3, semester: 5 },
    { id: "CS106", name: "Machine Learning", credits: 3, semester: 6 },
    { id: "CS107", name: "Web Technologies", credits: 3, semester: 5 },
    { id: "CS108", name: "Software Engineering", credits: 3, semester: 6 },
  ],
  ECE: [
    { id: "EC101", name: "Circuit Theory", credits: 4, semester: 3 },
    { id: "EC102", name: "Signal Processing", credits: 4, semester: 4 },
    { id: "EC103", name: "VLSI Design", credits: 3, semester: 5 },
    { id: "EC104", name: "Communication Systems", credits: 4, semester: 4 },
    { id: "EC105", name: "Embedded Systems", credits: 3, semester: 6 },
  ],
  ME: [
    { id: "ME101", name: "Thermodynamics", credits: 4, semester: 3 },
    { id: "ME102", name: "Fluid Mechanics", credits: 4, semester: 4 },
    { id: "ME103", name: "Machine Design", credits: 3, semester: 5 },
    { id: "ME104", name: "Manufacturing Technology", credits: 4, semester: 4 },
    { id: "ME105", name: "CAD/CAM", credits: 3, semester: 6 },
  ],
  CE: [
    { id: "CE101", name: "Structural Analysis", credits: 4, semester: 3 },
    { id: "CE102", name: "Geotechnical Engineering", credits: 4, semester: 4 },
    { id: "CE103", name: "Transportation Engineering", credits: 3, semester: 5 },
    { id: "CE104", name: "Environmental Engineering", credits: 3, semester: 5 },
    { id: "CE105", name: "Construction Management", credits: 3, semester: 6 },
  ],
};

const COMPANIES = [
  { id: "C001", name: "TCS", sector: "IT", location: "Mumbai" },
  { id: "C002", name: "Infosys", sector: "IT", location: "Bangalore" },
  { id: "C003", name: "Wipro", sector: "IT", location: "Bangalore" },
  { id: "C004", name: "Google", sector: "Tech", location: "Hyderabad" },
  { id: "C005", name: "Microsoft", sector: "Tech", location: "Hyderabad" },
  { id: "C006", name: "Amazon", sector: "Tech", location: "Bangalore" },
  { id: "C007", name: "L&T", sector: "Engineering", location: "Mumbai" },
  { id: "C008", name: "Tata Motors", sector: "Automotive", location: "Pune" },
  { id: "C009", name: "Mahindra", sector: "Automotive", location: "Mumbai" },
  { id: "C010", name: "Accenture", sector: "Consulting", location: "Bangalore" },
  { id: "C011", name: "Deloitte", sector: "Consulting", location: "Hyderabad" },
  { id: "C012", name: "Cognizant", sector: "IT", location: "Chennai" },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number) {
  return Math.round((rand() * (max - min) + min) * 100) / 100;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  gender: "Male" | "Female";
  dob: string;
  category: string;
  departmentId: string;
  semester: number;
  section: string;
  status: "Active" | "Graduated" | "Dropout";
  admissionYear: number;
  guardianName: string;
  guardianContact: string;
  cgpa: number;
  attendancePercent: number;
  feesPaid: number;
  totalFees: number;
}

export interface Faculty {
  id: string;
  name: string;
  qualification: string;
  experience: number;
  departmentId: string;
  designation: string;
  email: string;
  phone: string;
  publications: number;
}

export interface PlacementRecord {
  studentId: string;
  studentName: string;
  departmentId: string;
  companyId: string;
  companyName: string;
  packageLPA: number;
  year: number;
  isCore: boolean;
  higherStudies: boolean;
}

export interface MarkRecord {
  studentId: string;
  subjectId: string;
  subjectName: string;
  internal: number;
  external: number;
  total: number;
  grade: string;
}

export interface AttendanceRecord {
  month: string;
  year: number;
  departmentId: string;
  percentage: number;
}

export interface DepartmentStats {
  id: string;
  name: string;
  students: number;
  faculty: number;
  avgCGPA: number;
  placementPercent: number;
  avgPackage: number;
  attendancePercent: number;
  revenue: number;
}

// Generate students
function generateStudents(): Student[] {
  const students: Student[] = [];
  const categories = ["General", "OBC", "SC", "ST"];
  const sections = ["A", "B", "C"];
  const currentYear = 2026;

  for (let i = 0; i < 3000; i++) {
    const dept = DEPARTMENTS[i % 4];
    const admissionYear = currentYear - randInt(1, 4);
    const semester = Math.min((currentYear - admissionYear) * 2, 8);
    const isDropout = rand() < 0.07;
    const isGraduated = admissionYear <= currentYear - 4;
    const gender = rand() > 0.45 ? "Male" as const : "Female" as const;

    students.push({
      id: `STU${String(i + 1).padStart(4, "0")}`,
      rollNumber: `${dept.id}${admissionYear % 100}${String(i + 1).padStart(3, "0")}`,
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      gender,
      dob: `${2000 + randInt(0, 6)}-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
      category: pick(categories),
      departmentId: dept.id,
      semester,
      section: pick(sections),
      status: isDropout ? "Dropout" : isGraduated ? "Graduated" : "Active",
      admissionYear,
      guardianName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      guardianContact: `9${randInt(100000000, 999999999)}`,
      cgpa: randFloat(4.5, 9.8),
      attendancePercent: randFloat(55, 98),
      feesPaid: randInt(80000, 150000),
      totalFees: 150000,
    });
  }
  return students;
}

function generateFaculty(): Faculty[] {
  const faculty: Faculty[] = [];
  const designations = ["Assistant Professor", "Associate Professor", "Professor", "Senior Professor"];
  const qualifications = ["Ph.D.", "M.Tech", "M.E.", "Ph.D., Post-Doc"];

  for (let i = 0; i < 128; i++) {
    const dept = DEPARTMENTS[i % 4];
    const name = `${rand() > 0.6 ? "Dr. " : ""}${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    faculty.push({
      id: `FAC${String(i + 1).padStart(3, "0")}`,
      name,
      qualification: pick(qualifications),
      experience: randInt(2, 25),
      departmentId: dept.id,
      designation: pick(designations),
      email: `${name.replace(/Dr\. /g, "").toLowerCase().replace(/ /g, ".")}@institution.edu`,
      phone: `9${randInt(100000000, 999999999)}`,
      publications: randInt(0, 45),
    });
  }
  return faculty;
}

function generatePlacements(students: Student[]): PlacementRecord[] {
  const placements: PlacementRecord[] = [];
  const years = [2022, 2023, 2024, 2025, 2026];

  for (const year of years) {
    const eligible = students.filter(s => s.status !== "Dropout").slice(0, 600);
    const placed = eligible.filter(() => rand() < 0.75);

    for (const s of placed) {
      const company = pick(COMPANIES);
      const isCore = rand() < 0.35;
      placements.push({
        studentId: s.id,
        studentName: s.name,
        departmentId: s.departmentId,
        companyId: company.id,
        companyName: company.name,
        packageLPA: randFloat(3.5, 42),
        year,
        isCore,
        higherStudies: rand() < 0.12,
      });
    }
  }
  return placements;
}

function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (const dept of DEPARTMENTS) {
    for (let year = 2022; year <= 2026; year++) {
      for (const month of months) {
        records.push({
          month,
          year,
          departmentId: dept.id,
          percentage: randFloat(68, 95),
        });
      }
    }
  }
  return records;
}

// Singleton data store
let _students: Student[] | null = null;
let _faculty: Faculty[] | null = null;
let _placements: PlacementRecord[] | null = null;
let _attendance: AttendanceRecord[] | null = null;

export function getStudents(): Student[] {
  if (!_students) _students = generateStudents();
  return _students;
}

export function getFaculty(): Faculty[] {
  if (!_faculty) _faculty = generateFaculty();
  return _faculty;
}

export function getPlacements(): PlacementRecord[] {
  if (!_placements) _placements = generatePlacements(getStudents());
  return _placements;
}

export function getAttendance(): AttendanceRecord[] {
  if (!_attendance) _attendance = generateAttendance();
  return _attendance;
}

export function getDepartments() {
  return DEPARTMENTS;
}

export function getCompanies() {
  return COMPANIES;
}

export function getDepartmentStats(): DepartmentStats[] {
  const students = getStudents();
  const faculty = getFaculty();
  const placements = getPlacements();

  return DEPARTMENTS.map(dept => {
    const deptStudents = students.filter(s => s.departmentId === dept.id);
    const deptFaculty = faculty.filter(f => f.departmentId === dept.id);
    const deptPlacements = placements.filter(p => p.departmentId === dept.id && p.year === 2026);
    const activeStudents = deptStudents.filter(s => s.status === "Active");

    return {
      id: dept.id,
      name: dept.name,
      students: deptStudents.length,
      faculty: deptFaculty.length,
      avgCGPA: activeStudents.length ? +(activeStudents.reduce((a, s) => a + s.cgpa, 0) / activeStudents.length).toFixed(2) : 0,
      placementPercent: activeStudents.length ? Math.round((deptPlacements.length / (activeStudents.length * 0.25)) * 100) : 0,
      avgPackage: deptPlacements.length ? +(deptPlacements.reduce((a, p) => a + p.packageLPA, 0) / deptPlacements.length).toFixed(2) : 0,
      attendancePercent: +(activeStudents.reduce((a, s) => a + s.attendancePercent, 0) / (activeStudents.length || 1)).toFixed(1),
      revenue: deptStudents.reduce((a, s) => a + s.feesPaid, 0),
    };
  });
}

// Summary KPIs
export function getKPIs() {
  const students = getStudents();
  const faculty = getFaculty();
  const placements = getPlacements();
  const activeStudents = students.filter(s => s.status === "Active");
  const currentPlacements = placements.filter(p => p.year === 2026);

  const totalRevenue = students.reduce((a, s) => a + s.feesPaid, 0);
  const totalFees = students.reduce((a, s) => a + s.totalFees, 0);

  return {
    totalStudents: students.length,
    activeStudents: activeStudents.length,
    totalFaculty: faculty.length,
    studentFacultyRatio: +(activeStudents.length / faculty.length).toFixed(1),
    avgCGPA: +(activeStudents.reduce((a, s) => a + s.cgpa, 0) / activeStudents.length).toFixed(2),
    placementRate: Math.round((currentPlacements.length / (activeStudents.length * 0.25)) * 100),
    avgPackage: +(currentPlacements.reduce((a, p) => a + p.packageLPA, 0) / (currentPlacements.length || 1)).toFixed(2),
    highestPackage: currentPlacements.length ? Math.max(...currentPlacements.map(p => p.packageLPA)) : 0,
    avgAttendance: +(activeStudents.reduce((a, s) => a + s.attendancePercent, 0) / activeStudents.length).toFixed(1),
    revenueCollected: totalRevenue,
    revenuePercent: Math.round((totalRevenue / totalFees) * 100),
    dropoutRate: +((students.filter(s => s.status === "Dropout").length / students.length) * 100).toFixed(1),
    graduationRate: +((students.filter(s => s.status === "Graduated").length / students.length) * 100).toFixed(1),
    defaulters: activeStudents.filter(s => s.attendancePercent < 75).length,
    scholarshipStudents: Math.round(activeStudents.length * 0.12),
  };
}

// Chart data helpers
export function getCGPADistribution() {
  const students = getStudents().filter(s => s.status === "Active");
  const ranges = [
    { label: "< 5.0", min: 0, max: 5 },
    { label: "5.0–6.0", min: 5, max: 6 },
    { label: "6.0–7.0", min: 6, max: 7 },
    { label: "7.0–8.0", min: 7, max: 8 },
    { label: "8.0–9.0", min: 8, max: 9 },
    { label: "9.0+", min: 9, max: 10 },
  ];
  return ranges.map(r => ({
    range: r.label,
    count: students.filter(s => s.cgpa >= r.min && s.cgpa < r.max).length,
  }));
}

export function getPlacementTrend() {
  const placements = getPlacements();
  return [2022, 2023, 2024, 2025, 2026].map(year => {
    const yearPlacements = placements.filter(p => p.year === year);
    return {
      year: String(year),
      placed: yearPlacements.length,
      avgPackage: yearPlacements.length ? +(yearPlacements.reduce((a, p) => a + p.packageLPA, 0) / yearPlacements.length).toFixed(2) : 0,
      highestPackage: yearPlacements.length ? Math.max(...yearPlacements.map(p => p.packageLPA)) : 0,
    };
  });
}

export function getRevenueTrend() {
  return [2022, 2023, 2024, 2025, 2026].map(year => ({
    year: String(year),
    collected: randInt(35000000, 45000000),
    outstanding: randInt(2000000, 8000000),
  }));
}

export function getMonthlyAttendance(year: number = 2026) {
  const attendance = getAttendance().filter(a => a.year === year);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map(month => {
    const monthData = attendance.filter(a => a.month === month);
    return {
      month,
      ...Object.fromEntries(DEPARTMENTS.map(d => [d.id, monthData.find(m => m.departmentId === d.id)?.percentage || 0])),
    };
  });
}
