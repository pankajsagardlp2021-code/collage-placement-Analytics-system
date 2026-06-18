// Placement Charts Module - API Integrated
// Integrates with Chart.js to render database visualizations dynamically from Flask API

const API_BASE = "http://127.0.0.1:5001";

document.addEventListener("DOMContentLoaded", async () => {
  // Global Chart configurations for dark theme
  Chart.defaults.color = "#94a3b8"; // --text-secondary
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.9)";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(255, 255, 255, 0.1)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.titleColor = "#f8fafc";
  Chart.defaults.plugins.tooltip.bodyColor = "#e2e8f0";
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  
  // Default/Fallback Local Calculations
  function calculateLocalStats() {
    const branchData = { CSE: 0, IT: 0, ECE: 0, ME: 0 };
    const companyHiring = {};
    let placedCount = 0;
    let rejectedCount = 0;
    
    COMPANIES.forEach(c => {
      companyHiring[c.name] = 0;
    });
    
    PLACEMENTS.forEach(record => {
      const student = STUDENTS.find(s => s.id === record.studentId);
      if (record.status === "Placed") {
        placedCount++;
        if (student) {
          branchData[student.branch] = (branchData[student.branch] || 0) + 1;
        }
        const company = COMPANIES.find(c => c.id === record.companyId);
        if (company) {
          companyHiring[company.name] = (companyHiring[company.name] || 0) + 1;
        }
      } else if (record.status === "Rejected") {
        rejectedCount++;
      }
    });

    const skillCounts = {};
    SKILLS.forEach(skill => {
      skillCounts[skill] = 0;
    });
    STUDENTS.forEach(student => {
      student.skills.forEach(skill => {
        if (skillCounts[skill] !== undefined) {
          skillCounts[skill]++;
        }
      });
    });

    return {
      branchPlacements: branchData,
      companyHiring: companyHiring,
      selectionRatio: { Placed: placedCount, Rejected: rejectedCount },
      skillDistribution: skillCounts
    };
  }

  // Fetch dynamic stats from Flask or fallback to local
  let stats;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE}/api/analytics`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      stats = await response.json();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn("Analytics fetch failed. Falling back to local data.", err);
    stats = calculateLocalStats();
  }

  const { branchPlacements, companyHiring, selectionRatio, skillDistribution } = stats;

  // ----------------------------------------------------
  // DASHBOARD CHARTS (index.html)
  // ----------------------------------------------------
  
  // 1. Dashboard Branch Chart
  const dashboardBranchCtx = document.getElementById("dashboardBranchChart");
  if (dashboardBranchCtx) {
    const ctx = dashboardBranchCtx.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
    gradient.addColorStop(1, "rgba(139, 92, 246, 0.2)");
    
    new Chart(dashboardBranchCtx, {
      type: "bar",
      data: {
        labels: ["CSE", "IT", "ECE", "ME"],
        datasets: [{
          label: "Students Placed",
          data: [
            branchPlacements.CSE || 0,
            branchPlacements.IT || 0,
            branchPlacements.ECE || 0,
            branchPlacements.ME || 0
          ],
          backgroundColor: gradient,
          borderColor: "#3b82f6",
          borderWidth: 1.5,
          borderRadius: 8,
          barPercentage: 0.5,
          hoverBackgroundColor: "rgba(59, 130, 246, 0.95)",
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: "rgba(255,255,255,0.08)" }
          },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            border: { color: "rgba(255,255,255,0.08)" },
            ticks: { stepSize: 2 }
          }
        }
      }
    });
  }

  // 2. Dashboard Selection Ratio Chart
  const dashboardSelectionCtx = document.getElementById("dashboardSelectionChart");
  if (dashboardSelectionCtx) {
    new Chart(dashboardSelectionCtx, {
      type: "doughnut",
      data: {
        labels: ["Placed Offers", "Rejected Logs"],
        datasets: [{
          data: [selectionRatio.Placed || 0, selectionRatio.Rejected || 0],
          backgroundColor: ["rgba(16, 185, 129, 0.75)", "rgba(239, 68, 68, 0.75)"],
          borderColor: ["#10b981", "#ef4444"],
          borderWidth: 1,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 15,
              color: "#94a3b8"
            }
          }
        }
      }
    });
  }

  // ----------------------------------------------------
  // ANALYTICS CHARTS (analytics.html)
  // ----------------------------------------------------
  
  // 1. Detailed Branch Placement Chart
  const analyticsBranchCtx = document.getElementById("analyticsBranchChart");
  if (analyticsBranchCtx) {
    const ctx = analyticsBranchCtx.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.15)");
    
    new Chart(analyticsBranchCtx, {
      type: "bar",
      data: {
        labels: ["CSE", "IT", "ECE", "ME"],
        datasets: [{
          label: "Placed Students Count",
          data: [
            branchPlacements.CSE || 0,
            branchPlacements.IT || 0,
            branchPlacements.ECE || 0,
            branchPlacements.ME || 0
          ],
          backgroundColor: gradient,
          borderColor: "#8b5cf6",
          borderWidth: 1.5,
          borderRadius: 8,
          barPercentage: 0.45
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: "rgba(255,255,255,0.08)" }
          },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            border: { color: "rgba(255,255,255,0.08)" },
            ticks: { stepSize: 2 }
          }
        }
      }
    });
  }

  // 2. Company Wise Hiring Horizontal Bar Chart
  const analyticsCompanyCtx = document.getElementById("analyticsCompanyChart");
  if (analyticsCompanyCtx) {
    const ctx = analyticsCompanyCtx.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, "rgba(14, 165, 233, 0.2)");
    gradient.addColorStop(1, "rgba(14, 165, 233, 0.8)");
    
    const sortedCompanies = Object.keys(companyHiring).sort((a, b) => companyHiring[b] - companyHiring[a]);
    const sortedCounts = sortedCompanies.map(name => companyHiring[name]);

    new Chart(analyticsCompanyCtx, {
      type: "bar",
      data: {
        labels: sortedCompanies,
        datasets: [{
          label: "Recruited Students",
          data: sortedCounts,
          backgroundColor: gradient,
          borderColor: "#0ea5e9",
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.04)" },
            border: { color: "rgba(255,255,255,0.08)" },
            ticks: { stepSize: 1 }
          },
          y: {
            grid: { display: false },
            border: { color: "rgba(255,255,255,0.08)" }
          }
        }
      }
    });
  }

  // 3. Analytics Selection Ratio Chart
  const analyticsSelectionCtx = document.getElementById("analyticsSelectionChart");
  if (analyticsSelectionCtx) {
    new Chart(analyticsSelectionCtx, {
      type: "pie",
      data: {
        labels: ["Selected (Placed)", "Rejected"],
        datasets: [{
          data: [selectionRatio.Placed || 0, selectionRatio.Rejected || 0],
          backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(239, 68, 68, 0.8)"],
          borderColor: ["#10b981", "#ef4444"],
          borderWidth: 1.5,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 15,
              padding: 15,
              color: "#94a3b8"
            }
          }
        }
      }
    });
  }

  // 4. Skills Radar Chart
  const analyticsSkillsCtx = document.getElementById("analyticsSkillsChart");
  if (analyticsSkillsCtx) {
    const sortedSkills = Object.keys(skillDistribution);
    const sortedSkillValues = sortedSkills.map(skill => skillDistribution[skill]);

    new Chart(analyticsSkillsCtx, {
      type: "radar",
      data: {
        labels: sortedSkills,
        datasets: [{
          label: "Students possessing skill",
          data: sortedSkillValues,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "#3b82f6",
          pointBackgroundColor: "#8b5cf6",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#3b82f6",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            angleLines: { color: "rgba(255,255,255,0.08)" },
            grid: { color: "rgba(255,255,255,0.08)" },
            pointLabels: {
              color: "#94a3b8",
              font: { size: 10, weight: "600" }
            },
            ticks: {
              color: "#64748b",
              backdropColor: "transparent",
              stepSize: 5
            }
          }
        }
      }
    });
  }
});
