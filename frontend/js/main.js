// Main App Controller - API Integrated
// Manages shared navigation behavior, page renders, search and filter bindings with dynamic database fetch

const API_BASE_URL = "http://127.0.0.1:5001";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  
  // Page-specific routing based on DOM element presence
  if (document.getElementById("recent-placements-table")) {
    initDashboard();
  }
  if (document.getElementById("students-table-body")) {
    initStudentsPage();
  }
  if (document.getElementById("companies-card-grid")) {
    initCompaniesPage();
  }
  if (document.getElementById("placements-table-body")) {
    initPlacementsPage();
  }
});

// Helper function to safely fetch with timeout and error handling
async function safeFetch(url, fallbackData) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API Fetch failed for ${url}. Falling back to local database variables. Error:`, error);
    return fallbackData;
  }
}

// ----------------------------------------------------
// SHARED NAVIGATION ENGINE
// ----------------------------------------------------
function initNavigation() {
  const sidebar = document.getElementById("sidebar");
  const mobileToggle = document.getElementById("mobileToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  
  if (mobileToggle && sidebar && sidebarOverlay) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.add("open");
      sidebarOverlay.classList.add("open");
    });
    
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      sidebarOverlay.classList.remove("open");
    });
  }

  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf("/") + 1) || "index.html";
  
  document.querySelectorAll(".sidebar-menu-item").forEach(item => {
    item.classList.remove("active");
  });
  
  if (pageName === "index.html" || pageName === "") {
    document.getElementById("menu-dashboard")?.classList.add("active");
  } else if (pageName === "students.html") {
    document.getElementById("menu-students")?.classList.add("active");
  } else if (pageName === "companies.html") {
    document.getElementById("menu-companies")?.classList.add("active");
  } else if (pageName === "analytics.html") {
    document.getElementById("menu-analytics")?.classList.add("active");
  } else if (pageName === "placements.html") {
    document.getElementById("menu-placements")?.classList.add("active");
  }
}

// ----------------------------------------------------
// 1. DASHBOARD CONTROLLER (index.html)
// ----------------------------------------------------
async function initDashboard() {
  // Try to load KPIs from Flask API
  const localKpis = {
    totalStudents: STUDENTS.length,
    totalCompanies: COMPANIES.length,
    placedStudents: PLACEMENTS.filter(p => p.status === "Placed").length,
    highestPackage: Math.max(...COMPANIES.map(c => c.package)),
    placementPercentage: ((PLACEMENTS.filter(p => p.status === "Placed").length / STUDENTS.length) * 100).toFixed(1)
  };
  
  const kpis = await safeFetch(`${API_BASE_URL}/api/kpis`, localKpis);
  
  // Inject KPI DOM elements
  document.getElementById("kpi-total-students").textContent = kpis.totalStudents;
  document.getElementById("kpi-total-companies").textContent = kpis.totalCompanies;
  document.getElementById("kpi-placed-students").textContent = kpis.placedStudents;
  document.getElementById("kpi-highest-package").textContent = `${Number(kpis.highestPackage).toFixed(1)} LPA`;
  
  // Update percentage text in Placed card
  const trendSpan = document.querySelector("#kpi-placed-students ~ .kpi-trend");
  if (trendSpan) {
    trendSpan.innerHTML = `<i class="fa-solid fa-percent"></i> ${Number(kpis.placementPercentage).toFixed(1)}% Placement Rate`;
  }

  // Load Recent Placement Logs
  const fallbackLogs = [...PLACEMENTS]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(p => {
      const student = STUDENTS.find(s => s.id === p.studentId);
      const company = COMPANIES.find(c => c.id === p.companyId);
      return {
        studentName: student?.name || "Unknown",
        rollNo: student?.rollNo || "N/A",
        branch: student?.branch || "N/A",
        companyName: company?.name || "N/A",
        package: p.package || 0,
        status: p.status,
        date: p.date
      };
    });
    
  const apiPlacements = await safeFetch(`${API_BASE_URL}/api/placements`, []);
  const recentPlacements = apiPlacements.length > 0 ? apiPlacements.slice(0, 5) : fallbackLogs;
    
  const tableBody = document.getElementById("recent-placements-table");
  if (tableBody) {
    tableBody.innerHTML = "";
    recentPlacements.forEach(record => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${record.studentName}</strong></td>
        <td>${record.rollNo || "N/A"}</td>
        <td><span class="badge badge-branch ${record.branch.toLowerCase()}">${record.branch}</span></td>
        <td>${record.companyName}</td>
        <td>${record.status === 'Placed' ? `${Number(record.package).toFixed(1)} LPA` : '-'}</td>
        <td><span class="badge ${record.status === 'Placed' ? 'badge-placed' : 'badge-rejected'}">${record.status}</span></td>
        <td>${record.date}</td>
      `;
      tableBody.appendChild(tr);
    });
  }
}

// ----------------------------------------------------
// 2. STUDENTS DIRECTORY CONTROLLER (students.html)
// ----------------------------------------------------
async function initStudentsPage() {
  const searchInput = document.getElementById("student-search-input");
  const branchFilter = document.getElementById("student-branch-filter");
  const statusFilter = document.getElementById("student-status-filter");
  const resetBtn = document.getElementById("student-reset-btn");
  const recordCountSpan = document.getElementById("student-record-count");
  
  // Fetch from API or fallback
  const studentsList = await safeFetch(`${API_BASE_URL}/api/students`, STUDENTS);
  
  function renderStudentsTable(filteredStudents) {
    const tableBody = document.getElementById("students-table-body");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    
    if (filteredStudents.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="no-records">
              <i class="fa-solid fa-folder-open"></i>
              <p>No matching student profiles found.</p>
            </div>
          </td>
        </tr>
      `;
      recordCountSpan.textContent = `Showing 0 of ${studentsList.length} students`;
      return;
    }
    
    filteredStudents.forEach(student => {
      const skillsHTML = student.skills
        .map(skill => `<span class="skill-tag">${skill}</span>`)
        .join("");
        
      let statusBadgeClass = "badge-progress";
      if (student.status === "Placed") statusBadgeClass = "badge-placed";
      if (student.status === "Rejected") statusBadgeClass = "badge-rejected";
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="display:flex; flex-direction:column;">
            <strong>${student.name}</strong>
            <span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">${student.email}</span>
          </div>
        </td>
        <td>${student.rollNo}</td>
        <td><span class="badge badge-branch ${student.branch.toLowerCase()}">${student.branch}</span></td>
        <td style="font-weight:700;">${Number(student.gpa).toFixed(2)}</td>
        <td><div class="skills-tags">${skillsHTML}</div></td>
        <td><span class="badge ${statusBadgeClass}">${student.status}</span></td>
      `;
      tableBody.appendChild(tr);
    });
    
    recordCountSpan.textContent = `Showing ${filteredStudents.length} of ${studentsList.length} students`;
  }

  function applyFilters() {
    const searchVal = searchInput.value.toLowerCase().trim();
    const branchVal = branchFilter.value;
    const statusVal = statusFilter.value;
    
    const filtered = studentsList.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchVal) || 
                            student.rollNo.toLowerCase().includes(searchVal) ||
                            student.skills.some(skill => skill.toLowerCase().includes(searchVal));
                            
      const matchesBranch = (branchVal === "All" || student.branch === branchVal);
      const matchesStatus = (statusVal === "All" || student.status === statusVal);
      
      return matchesSearch && matchesBranch && matchesStatus;
    });
    
    renderStudentsTable(filtered);
  }

  // Bind Listeners
  searchInput.addEventListener("input", applyFilters);
  branchFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    branchFilter.value = "All";
    statusFilter.value = "All";
    renderStudentsTable(studentsList);
  });
  
  // Initial render
  renderStudentsTable(studentsList);
}

// ----------------------------------------------------
// 3. COMPANIES DIRECTORY CONTROLLER (companies.html)
// ----------------------------------------------------
async function initCompaniesPage() {
  const searchInput = document.getElementById("company-search-input");
  const packageFilter = document.getElementById("company-package-filter");
  const resetBtn = document.getElementById("company-reset-btn");
  
  // Fetch from API or fallback
  const companiesList = await safeFetch(`${API_BASE_URL}/api/companies`, COMPANIES);
  
  function renderCompaniesGrid(filteredCompanies) {
    const gridContainer = document.getElementById("companies-card-grid");
    if (!gridContainer) return;
    
    gridContainer.innerHTML = "";
    
    if (filteredCompanies.length === 0) {
      gridContainer.innerHTML = `
        <div class="no-records" style="grid-column: 1 / -1; width: 100%;">
          <i class="fa-solid fa-building-circle-exclamation"></i>
          <p>No hiring partners match your criteria.</p>
        </div>
      `;
      return;
    }
    
    filteredCompanies.forEach(company => {
      // Preferred skills map (default fallback if not in JSON)
      let skillsTarget = company.skills || [];
      if (skillsTarget.length === 0) {
        if (company.name === "Google" || company.name === "Amazon") {
          skillsTarget = ["Data Structures", "Java", "Python", "C++", "Machine Learning"];
        } else if (company.name === "IBM" || company.name === "Accenture") {
          skillsTarget = ["SQL", "Java", "Cloud Computing", "Power BI"];
        } else {
          skillsTarget = ["Java", "SQL", "Web Development", "Communication"];
        }
      }
      
      const skillsHTML = skillsTarget
        .map(skill => `<span class="skill-tag">${skill}</span>`)
        .join("");
        
      const card = document.createElement("div");
      card.className = "glass-card company-card";
      card.innerHTML = `
        <div class="company-header">
          <div class="company-icon" style="background-color: ${company.color || '#475569'};">
            <i class="${company.logo || 'fa-solid fa-briefcase'}"></i>
          </div>
          <div class="company-info">
            <span class="company-name">${company.name}</span>
            <span class="company-industry">${company.industry || 'Technology'}</span>
          </div>
        </div>
        
        <div class="company-stats">
          <div>
            <span class="company-stat-lbl">Offer Package</span>
            <div class="company-stat-val" style="color: var(--color-amber);">${Number(company.package).toFixed(1)} LPA</div>
          </div>
          <div>
            <span class="company-stat-lbl">Students Hired</span>
            <div class="company-stat-val" style="color: var(--color-emerald);">${company.hiredCount} Placed</div>
          </div>
        </div>
        
        <div class="company-stats" style="grid-template-columns: 1fr; margin-top: -0.5rem; padding: 0.6rem 0.85rem;">
          <div>
            <span class="company-stat-lbl">Eligibility Criteria</span>
            <div style="font-size: 0.85rem; font-weight:600; margin-top:0.15rem; color: var(--text-primary);">
              Minimum GPA: ${Number(company.minGpa || 6.0).toFixed(1)} / 10.0
            </div>
          </div>
        </div>
        
        <div class="company-footer-skills">
          <span class="company-skills-label">Preferred Skills</span>
          <div class="skills-tags">${skillsHTML}</div>
        </div>
      `;
      gridContainer.appendChild(card);
    });
  }

  function applyCompanyFilters() {
    const searchVal = searchInput.value.toLowerCase().trim();
    const packageVal = packageFilter.value;
    
    const filtered = companiesList.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchVal) || 
                            (company.industry && company.industry.toLowerCase().includes(searchVal));
                            
      let matchesPackage = true;
      if (packageVal === "High") {
        matchesPackage = company.package > 15.0;
      } else if (packageVal === "Mid") {
        matchesPackage = company.package >= 5.0 && company.package <= 15.0;
      } else if (packageVal === "Entry") {
        matchesPackage = company.package < 5.0;
      }
      
      return matchesSearch && matchesPackage;
    });
    
    renderCompaniesGrid(filtered);
  }

  // Bind Listeners
  searchInput.addEventListener("input", applyCompanyFilters);
  packageFilter.addEventListener("change", applyCompanyFilters);
  
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    packageFilter.value = "All";
    renderCompaniesGrid(companiesList);
  });
  
  window.renderCompaniesGrid = renderCompaniesGrid;
  renderCompaniesGrid(companiesList);
}

// ----------------------------------------------------
// 4. PLACEMENT LOGS CONTROLLER (placements.html)
// ----------------------------------------------------
async function initPlacementsPage() {
  const tableBody = document.getElementById("placements-table-body");
  const logCountSpan = document.getElementById("placement-log-count");
  const companyFilter = document.getElementById("placement-company-filter");
  const resetBtn = document.getElementById("placement-reset-btn");
  
  let currentStatusTab = "All";
  
  // Fetch companies for dropdown list, fallback if failed
  const companiesList = await safeFetch(`${API_BASE_URL}/api/companies`, COMPANIES);
  if (companyFilter) {
    companyFilter.innerHTML = `<option value="All">All Companies</option>`;
    companiesList.forEach(comp => {
      const opt = document.createElement("option");
      opt.value = comp.id;
      opt.textContent = comp.name;
      companyFilter.appendChild(opt);
    });
  }

  // Fetch placement logs from API
  const fallbackLogs = PLACEMENTS.map(p => {
    const student = STUDENTS.find(s => s.id === p.studentId);
    const company = COMPANIES.find(c => c.id === p.companyId);
    return {
      studentName: student?.name || "Unknown",
      branch: student?.branch || "N/A",
      companyId: p.companyId,
      companyName: company?.name || "N/A",
      package: p.package || 0,
      status: p.status,
      date: p.date
    };
  });
  
  const placementsList = await safeFetch(`${API_BASE_URL}/api/placements`, fallbackLogs);

  function renderPlacementsTable() {
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    const selectedCompanyId = companyFilter.value;
    
    const filtered = placementsList.filter(record => {
      const matchesCompany = (selectedCompanyId === "All" || record.companyId == selectedCompanyId);
      const matchesTab = (currentStatusTab === "All" || record.status === currentStatusTab);
      return matchesCompany && matchesTab;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="no-records">
              <i class="fa-solid fa-inbox"></i>
              <p>No matching placement logs found.</p>
            </div>
          </td>
        </tr>
      `;
      logCountSpan.textContent = `Showing 0 of ${placementsList.length} records`;
      return;
    }

    filtered.forEach(record => {
      const companyColor = record.companyColor || (companiesList.find(c => c.name === record.companyName)?.color) || "#475569";
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${record.studentName}</strong></td>
        <td><span class="badge badge-branch ${record.branch.toLowerCase()}">${record.branch}</span></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${companyColor}"></span>
            ${record.companyName}
          </div>
        </td>
        <td>${record.status === "Placed" ? `${Number(record.package).toFixed(1)} LPA` : "-"}</td>
        <td><span class="badge ${record.status === 'Placed' ? 'badge-placed' : 'badge-rejected'}">${record.status}</span></td>
        <td>${record.date}</td>
      `;
      tableBody.appendChild(tr);
    });
    
    logCountSpan.textContent = `Showing ${filtered.length} of ${placementsList.length} records`;
  }

  // Setup tab listeners
  const tabAll = document.getElementById("placement-tab-all");
  const tabPlaced = document.getElementById("placement-tab-placed");
  const tabRejected = document.getElementById("placement-tab-rejected");
  
  function handleTabClick(btn, status) {
    [tabAll, tabPlaced, tabRejected].forEach(tab => tab?.classList.remove("active"));
    btn.classList.add("active");
    currentStatusTab = status;
    renderPlacementsTable();
  }

  if (tabAll) tabAll.addEventListener("click", () => handleTabClick(tabAll, "All"));
  if (tabPlaced) tabPlaced.addEventListener("click", () => handleTabClick(tabPlaced, "Placed"));
  if (tabRejected) tabRejected.addEventListener("click", () => handleTabClick(tabRejected, "Rejected"));
  
  if (companyFilter) {
    companyFilter.addEventListener("change", renderPlacementsTable);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      companyFilter.value = "All";
      handleTabClick(tabAll, "All");
    });
  }

  renderPlacementsTable();
}
