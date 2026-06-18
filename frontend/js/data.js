// Placement Data Module containing 50 Students, 10 Companies, 30 Placement Records (25 Placed, 5 Rejected)
// Configured to load as global variables for robust direct local browser opening

const COMPANIES = [
  { id: 1, name: "TCS", package: 3.5, logo: "fa-solid fa-square-poll-vertical", color: "#1e3a8a", industry: "IT Services", minGpa: 6.5 },
  { id: 2, name: "Infosys", package: 4.0, logo: "fa-solid fa-desktop", color: "#0369a1", industry: "IT Consulting", minGpa: 6.8 },
  { id: 3, name: "Wipro", package: 4.2, logo: "fa-solid fa-network-wired", color: "#0f766e", industry: "IT Services", minGpa: 6.5 },
  { id: 4, name: "Accenture", package: 5.0, logo: "fa-solid fa-chart-line", color: "#7e22ce", industry: "Management Consulting", minGpa: 7.0 },
  { id: 5, name: "Cognizant", package: 4.5, logo: "fa-solid fa-gears", color: "#be185d", industry: "IT Services", minGpa: 6.8 },
  { id: 6, name: "Capgemini", package: 4.8, logo: "fa-solid fa-project-diagram", color: "#0369a1", industry: "Technology Services", minGpa: 6.8 },
  { id: 7, name: "HCL", package: 4.0, logo: "fa-solid fa-microchip", color: "#0284c7", industry: "Hardware & Software", minGpa: 6.5 },
  { id: 8, name: "IBM", package: 6.5, logo: "fa-solid fa-server", color: "#1d4ed8", industry: "Enterprise Systems", minGpa: 7.2 },
  { id: 9, name: "Amazon", package: 25.0, logo: "fa-brands fa-amazon", color: "#ea580c", industry: "E-Commerce & Cloud", minGpa: 8.5 },
  { id: 10, name: "Google", package: 30.0, logo: "fa-brands fa-google", color: "#db4437", industry: "Search & Tech", minGpa: 8.8 }
];

const SKILLS = [
  "Java", "Python", "SQL", "C++", "Data Structures",
  "Machine Learning", "Web Development", "Cloud Computing",
  "Power BI", "Communication"
];

// 50 Student Records
const STUDENTS = [
  { id: 1, name: "Aarav Sharma", rollNo: "2026CSE01", branch: "CSE", gpa: 9.2, email: "aarav.sharma@college.edu", skills: ["Java", "Data Structures", "Web Development", "SQL"], status: "Placed" },
  { id: 2, name: "Aditya Patel", rollNo: "2026CSE02", branch: "CSE", gpa: 8.9, email: "aditya.patel@college.edu", skills: ["Python", "Machine Learning", "SQL"], status: "Placed" },
  { id: 3, name: "Akash Verma", rollNo: "2026CSE03", branch: "CSE", gpa: 8.5, email: "akash.verma@college.edu", skills: ["C++", "Data Structures", "Cloud Computing"], status: "Placed" },
  { id: 4, name: "Ananya Iyer", rollNo: "2026CSE04", branch: "CSE", gpa: 9.5, email: "ananya.iyer@college.edu", skills: ["Java", "Python", "Web Development", "Communication"], status: "Placed" },
  { id: 5, name: "Aniket Deshmukh", rollNo: "2026CSE05", branch: "CSE", gpa: 7.8, email: "aniket.desh@college.edu", skills: ["Java", "SQL", "Communication"], status: "Placed" },
  { id: 6, name: "Arjun Reddy", rollNo: "2026CSE06", branch: "CSE", gpa: 8.2, email: "arjun.reddy@college.edu", skills: ["C++", "Data Structures", "SQL"], status: "Placed" },
  { id: 7, name: "Ayush Gupta", rollNo: "2026CSE07", branch: "CSE", gpa: 7.5, email: "ayush.gupta@college.edu", skills: ["Python", "Web Development", "SQL"], status: "Placed" },
  { id: 8, name: "Devendra Singh", rollNo: "2026CSE08", branch: "CSE", gpa: 9.4, email: "devendra.singh@college.edu", skills: ["Python", "Machine Learning", "Cloud Computing", "Data Structures"], status: "Placed" },
  { id: 9, name: "Divya Joshi", rollNo: "2026CSE09", branch: "CSE", gpa: 8.7, email: "divya.joshi@college.edu", skills: ["Java", "SQL", "Web Development"], status: "Placed" },
  { id: 10, name: "Ishaan Mehta", rollNo: "2026CSE10", branch: "CSE", gpa: 7.9, email: "ishaan.mehta@college.edu", skills: ["C++", "Web Development", "Communication"], status: "Placed" },
  { id: 11, name: "Karan Johar", rollNo: "2026CSE11", branch: "CSE", gpa: 8.1, email: "karan.johar@college.edu", skills: ["Java", "SQL", "Cloud Computing"], status: "Rejected" },
  { id: 12, name: "Kunal Kapoor", rollNo: "2026CSE12", branch: "CSE", gpa: 7.3, email: "kunal.kapoor@college.edu", skills: ["Python", "Communication"], status: "Rejected" },
  { id: 13, name: "Meera Nair", rollNo: "2026CSE13", branch: "CSE", gpa: 8.6, email: "meera.nair@college.edu", skills: ["Java", "Data Structures", "SQL"], status: "In Progress" },
  { id: 14, name: "Neha Sen", rollNo: "2026CSE14", branch: "CSE", gpa: 8.8, email: "neha.sen@college.edu", skills: ["Python", "Web Development", "Power BI"], status: "In Progress" },
  { id: 15, name: "Nikhil Rao", rollNo: "2026CSE15", branch: "CSE", gpa: 7.6, email: "nikhil.rao@college.edu", skills: ["C++", "SQL"], status: "In Progress" },
  { id: 16, name: "Pranav Shah", rollNo: "2026CSE16", branch: "CSE", gpa: 8.3, email: "pranav.shah@college.edu", skills: ["Java", "Data Structures", "Cloud Computing"], status: "In Progress" },
  { id: 17, name: "Pooja Hegde", rollNo: "2026CSE17", branch: "CSE", gpa: 9.0, email: "pooja.hegde@college.edu", skills: ["Python", "Machine Learning", "Web Development"], status: "In Progress" },
  { id: 18, name: "Rahul Dravid", rollNo: "2026CSE18", branch: "CSE", gpa: 7.4, email: "rahul.dravid@college.edu", skills: ["Java", "SQL", "Communication"], status: "In Progress" },
  
  { id: 19, name: "Rohan Gavaskar", rollNo: "2026IT01", branch: "IT", gpa: 8.4, email: "rohan.gav@college.edu", skills: ["Java", "Web Development", "SQL"], status: "Placed" },
  { id: 20, name: "Sanjana Roy", rollNo: "2026IT02", branch: "IT", gpa: 8.8, email: "sanjana.roy@college.edu", skills: ["Python", "Cloud Computing", "SQL"], status: "Placed" },
  { id: 21, name: "Saurabh Shukla", rollNo: "2026IT03", branch: "IT", gpa: 8.1, email: "saurabh.shukla@college.edu", skills: ["C++", "Data Structures", "Power BI"], status: "Placed" },
  { id: 22, name: "Shreya Ghoshal", rollNo: "2026IT04", branch: "IT", gpa: 9.1, email: "shreya.ghoshal@college.edu", skills: ["Java", "Web Development", "Communication", "SQL"], status: "Placed" },
  { id: 23, name: "Siddharth Malhotra", rollNo: "2026IT05", branch: "IT", gpa: 7.9, email: "sid.mal@college.edu", skills: ["Python", "SQL", "Communication"], status: "Placed" },
  { id: 24, name: "Tanmay Bhat", rollNo: "2026IT06", branch: "IT", gpa: 8.0, email: "tanmay.bhat@college.edu", skills: ["Java", "Web Development", "Cloud Computing"], status: "Placed" },
  { id: 25, name: "Varun Dhawan", rollNo: "2026IT07", branch: "IT", gpa: 8.3, email: "varun.dhawan@college.edu", skills: ["Python", "SQL", "Data Structures"], status: "Placed" },
  { id: 26, name: "Vikram Seth", rollNo: "2026IT08", branch: "IT", gpa: 7.7, email: "vikram.seth@college.edu", skills: ["Java", "Communication"], status: "Rejected" },
  { id: 27, name: "Abhinav Bindra", rollNo: "2026IT09", branch: "IT", gpa: 8.2, email: "abhinav.bindra@college.edu", skills: ["C++", "SQL", "Web Development"], status: "In Progress" },
  { id: 28, name: "Aditi Rao", rollNo: "2026IT10", branch: "IT", gpa: 8.5, email: "aditi.rao@college.edu", skills: ["Python", "Data Structures", "Cloud Computing"], status: "In Progress" },
  { id: 29, name: "Alok Nath", rollNo: "2026IT11", branch: "IT", gpa: 7.2, email: "alok.nath@college.edu", skills: ["Java", "SQL"], status: "In Progress" },
  { id: 30, name: "Amit Mishra", rollNo: "2026IT12", branch: "IT", gpa: 7.8, email: "amit.mishra@college.edu", skills: ["Python", "Web Development"], status: "In Progress" },
  { id: 31, name: "Anupam Kher", rollNo: "2026IT13", branch: "IT", gpa: 8.0, email: "anupam.kher@college.edu", skills: ["Java", "Communication", "Power BI"], status: "In Progress" },
  { id: 32, name: "Bhuvan Bam", rollNo: "2026IT14", branch: "IT", gpa: 7.5, email: "bhuvan.bam@college.edu", skills: ["C++", "SQL", "Communication"], status: "In Progress" },
  
  { id: 33, name: "Chaitanya Prasad", rollNo: "2026ECE01", branch: "ECE", gpa: 8.5, email: "chaitanya.p@college.edu", skills: ["C++", "SQL", "Cloud Computing"], status: "Placed" },
  { id: 34, name: "Deepika Padukone", rollNo: "2026ECE02", branch: "ECE", gpa: 8.2, email: "deepika.pad@college.edu", skills: ["Java", "SQL", "Communication"], status: "Placed" },
  { id: 35, name: "Gaurav Gera", rollNo: "2026ECE03", branch: "ECE", gpa: 7.8, email: "gaurav.gera@college.edu", skills: ["Python", "Data Structures", "Communication"], status: "Placed" },
  { id: 36, name: "Harbhajan Singh", rollNo: "2026ECE04", branch: "ECE", gpa: 8.0, email: "harbhajan.s@college.edu", skills: ["C++", "Web Development", "SQL"], status: "Placed" },
  { id: 37, name: "Jasprit Bumrah", rollNo: "2026ECE05", branch: "ECE", gpa: 8.3, email: "jasprit.b@college.edu", skills: ["Python", "Cloud Computing", "Power BI"], status: "Placed" },
  { id: 38, name: "Kapil Dev", rollNo: "2026ECE06", branch: "ECE", gpa: 7.4, email: "kapil.dev@college.edu", skills: ["Java", "SQL"], status: "Rejected" },
  { id: 39, name: "Kiran Bedi", rollNo: "2026ECE07", branch: "ECE", gpa: 8.6, email: "kiran.bedi@college.edu", skills: ["Python", "Data Structures", "Machine Learning"], status: "In Progress" },
  { id: 40, name: "Lata Mangeshkar", rollNo: "2026ECE08", branch: "ECE", gpa: 8.9, email: "lata.m@college.edu", skills: ["Java", "Communication", "Web Development"], status: "In Progress" },
  { id: 41, name: "Mithali Raj", rollNo: "2026ECE09", branch: "ECE", gpa: 8.1, email: "mithali.raj@college.edu", skills: ["C++", "SQL", "Cloud Computing"], status: "In Progress" },
  { id: 42, name: "MS Dhoni", rollNo: "2026ECE10", branch: "ECE", gpa: 9.0, email: "ms.dhoni@college.edu", skills: ["Python", "Data Structures", "Communication", "SQL"], status: "In Progress" },
  { id: 43, name: "Narendra Modi", rollNo: "2026ECE11", branch: "ECE", gpa: 7.7, email: "narendra.modi@college.edu", skills: ["Java", "Communication", "Power BI"], status: "In Progress" },
  { id: 44, name: "Pranab Mukherjee", rollNo: "2026ECE12", branch: "ECE", gpa: 8.4, email: "pranab.m@college.edu", skills: ["C++", "SQL", "Cloud Computing"], status: "In Progress" },
  
  { id: 45, name: "Rajinikanth", rollNo: "2026ME01", branch: "ME", gpa: 8.2, email: "rajini@college.edu", skills: ["Python", "SQL", "Communication"], status: "Placed" },
  { id: 46, name: "Sachin Tendulkar", rollNo: "2026ME02", branch: "ME", gpa: 8.7, email: "sachin.t@college.edu", skills: ["Java", "Communication", "Power BI"], status: "Placed" },
  { id: 47, name: "Sourav Ganguly", rollNo: "2026ME03", branch: "ME", gpa: 7.9, email: "sourav.g@college.edu", skills: ["C++", "SQL", "Power BI"], status: "Placed" },
  { id: 48, name: "Sunil Gavaskar", rollNo: "2026ME04", branch: "ME", gpa: 7.5, email: "sunil.g@college.edu", skills: ["Java", "SQL"], status: "Rejected" },
  { id: 49, name: "Virat Kohli", rollNo: "2026ME05", branch: "ME", gpa: 8.8, email: "virat.kohli@college.edu", skills: ["Python", "Data Structures", "Communication"], status: "In Progress" },
  { id: 50, name: "Yuvraj Singh", rollNo: "2026ME06", branch: "ME", gpa: 8.1, email: "yuvraj.s@college.edu", skills: ["C++", "Cloud Computing", "Communication"], status: "In Progress" }
];

// 30 Placement Logs (25 Placed, 5 Rejected)
const PLACEMENTS = [
  { id: 1, studentId: 1, companyId: 10, package: 30.0, status: "Placed", date: "2026-04-10" }, // Aarav -> Google (30 LPA)
  { id: 2, studentId: 2, companyId: 9, package: 25.0, status: "Placed", date: "2026-04-12" },  // Aditya -> Amazon (25 LPA)
  { id: 3, studentId: 3, companyId: 8, package: 6.5, status: "Placed", date: "2026-04-15" },   // Akash -> IBM (6.5 LPA)
  { id: 4, studentId: 4, companyId: 6, package: 4.8, status: "Placed", date: "2026-04-18" },   // Ananya -> Capgemini (4.8 LPA)
  { id: 5, studentId: 5, companyId: 5, package: 4.5, status: "Placed", date: "2026-04-20" },   // Aniket -> Cognizant (4.5 LPA)
  { id: 6, studentId: 6, companyId: 5, package: 4.5, status: "Placed", date: "2026-04-20" },   // Arjun -> Cognizant (4.5 LPA)
  { id: 7, studentId: 7, companyId: 4, package: 5.0, status: "Placed", date: "2026-04-22" },   // Ayush -> Accenture (5.0 LPA)
  { id: 8, studentId: 8, companyId: 3, package: 4.2, status: "Placed", date: "2026-04-25" },   // Devendra -> Wipro (4.2 LPA)
  { id: 9, studentId: 9, companyId: 3, package: 4.2, status: "Placed", date: "2026-04-25" },   // Divya -> Wipro (4.2 LPA)
  { id: 10, studentId: 10, companyId: 2, package: 4.0, status: "Placed", date: "2026-04-27" }, // Ishaan -> Infosys (4.0 LPA)
  
  { id: 11, studentId: 19, companyId: 1, package: 3.5, status: "Placed", date: "2026-04-28" }, // Rohan -> TCS (3.5 LPA)
  { id: 12, studentId: 20, companyId: 2, package: 4.0, status: "Placed", date: "2026-04-30" }, // Sanjana -> Infosys (4.0 LPA)
  { id: 13, studentId: 21, companyId: 3, package: 4.2, status: "Placed", date: "2026-05-02" }, // Saurabh -> Wipro (4.2 LPA)
  { id: 14, studentId: 22, companyId: 4, package: 5.0, status: "Placed", date: "2026-05-04" }, // Shreya -> Accenture (5.0 LPA)
  { id: 15, studentId: 23, companyId: 5, package: 4.5, status: "Placed", date: "2026-05-06" }, // Siddharth -> Cognizant (4.5 LPA)
  { id: 16, studentId: 24, companyId: 6, package: 4.8, status: "Placed", date: "2026-05-08" }, // Tanmay -> Capgemini (4.8 LPA)
  { id: 17, studentId: 25, companyId: 1, package: 3.5, status: "Placed", date: "2026-05-10" }, // Varun -> TCS (3.5 LPA)
  
  { id: 18, studentId: 33, companyId: 1, package: 3.5, status: "Placed", date: "2026-05-12" }, // Chaitanya -> TCS (3.5 LPA)
  { id: 19, studentId: 34, companyId: 2, package: 4.0, status: "Placed", date: "2026-05-15" }, // Deepika -> Infosys (4.0 LPA)
  { id: 20, studentId: 35, companyId: 3, package: 4.2, status: "Placed", date: "2026-05-18" }, // Gaurav -> Wipro (4.2 LPA)
  { id: 21, studentId: 36, companyId: 4, package: 5.0, status: "Placed", date: "2026-05-20" }, // Harbhajan -> Accenture (5.0 LPA)
  { id: 22, studentId: 37, companyId: 1, package: 3.5, status: "Placed", date: "2026-05-22" }, // Jasprit -> TCS (3.5 LPA)
  
  { id: 23, studentId: 45, companyId: 1, package: 3.5, status: "Placed", date: "2026-05-25" }, // Rajinikanth -> TCS (3.5 LPA)
  { id: 24, studentId: 46, companyId: 2, package: 4.0, status: "Placed", date: "2026-05-28" }, // Sachin -> Infosys (4.0 LPA)
  { id: 25, studentId: 47, companyId: 7, package: 4.0, status: "Placed", date: "2026-06-01" }, // Sourav -> HCL (4.0 LPA)
  
  { id: 26, studentId: 11, companyId: 10, package: 0, status: "Rejected", date: "2026-04-09" }, // Karan -> Rejected at Google
  { id: 27, studentId: 12, companyId: 9, package: 0, status: "Rejected", date: "2026-04-11" },  // Kunal -> Rejected at Amazon
  { id: 28, studentId: 26, companyId: 4, package: 0, status: "Rejected", date: "2026-05-03" },  // Vikram -> Rejected at Accenture
  { id: 29, studentId: 38, companyId: 8, package: 0, status: "Rejected", date: "2026-05-14" },  // Kapil -> Rejected at IBM
  { id: 30, studentId: 48, companyId: 5, package: 0, status: "Rejected", date: "2026-05-24" }   // Sunil -> Rejected at Cognizant
];
