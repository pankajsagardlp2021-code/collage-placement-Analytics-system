# Project Structure

This document details the file tree and explanations of components within the **College Placement Analytics System**.

---

## 📁 Directory Layout

```
collage-placement-Analytics-system/
│
├── frontend/                     # Client-side web dashboard
│   ├── index.html                # Main dashboard summary page
│   ├── students.html             # Student directory profiles
│   ├── companies.html            # Recruiting corporate partners grid
│   ├── analytics.html            # Analytics and Chart.js reports
│   ├── placements.html           # Historical placement drive logs
│   │
│   ├── css/                      
│   │   └── style.css             # Glassmorphism dark layout rules
│   │
│   └── js/                       
│       ├── data.js               # In-memory database fallback metrics
│       ├── charts.js             # Chart.js configs and renders (connects to port 5001)
│       └── main.js               # DOM binding and filter controls (connects to port 5001)
│
├── database/                     # Database files
│   ├── create_tables.sql         # SQL Server DDL script
│   └── insert_data.sql           # SQL Server insert scripts
│
├── backend/                      # Python backend components
│   ├── app.py                    # Flask REST API server (port 5001)
│   ├── db_connection.py          # Database connection module (PyODBC)
│   ├── charts.py                 # Matplotlib local statistics scripts
│   └── reports.py                # SQL query tests using Pandas
│
├── docs/                         
│   └── project_Requirements.txt  # System specifications reference
│
└── screenshorts/                 # Screenshots of the client interfaces
    ├── dashboard_overview.png
    ├── students_directory.png
    ├── students_filtered.png
    ├── companies_directory.png
    └── company_details.png
```

---

## 📂 Detailed File Descriptions

### 💻 Client Side (`frontend/`)

#### HTML Page Modules
*   **[index.html](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/index.html)**: Bootstraps the application. It lists the four core placement KPIs and showcases two compact overview charts.
*   **[students.html](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/students.html)**: Contains search inputs to query names/skills and filter dropdowns.
*   **[companies.html](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/companies.html)**: Holds the grid container where company cards are instantiated.
*   **[analytics.html](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/analytics.html)**: Houses the four canvases for detailed Chart.js distribution charts.
*   **[placements.html](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/placements.html)**: Contains a table listing interview status histories (Placed vs Rejected).

#### Styling System (`css/`)
*   **[style.css](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/css/style.css)**: Implements CSS variables, scrollbar templates, active state indicators for sidebar links, and media queries for responsiveness.

#### Javascript Assets (`js/`)
*   **[data.js](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/js/data.js)**: Configures global constants (`COMPANIES`, `STUDENTS`, `PLACEMENTS`, `SKILLS`) containing exact database records used as local fallbacks if the Flask API is offline.
*   **[charts.js](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/js/charts.js)**: Aggregates stats dynamically in-memory and renders them using Chart.js configurations. Queries the `/api/analytics` endpoint on port `5001`.
*   **[main.js](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/frontend/js/main.js)**: Handles sidebar routing, mobile toggling, search query comparisons, dynamic table generation, and package tier calculations. Connects to `/api/` endpoints on port `5001`.

---

### 🗄️ Database & Scripts (`database/` & `backend/`)
*   **[create_tables.sql](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/database/create_tables.sql)**: Structure scripts for tables (`Students`, `Companies`, `Skills`, `StudentSkills`, `Placements`).
*   **[db_connection.py](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/backend/db_connection.py)**: Establishes connection using PyODBC pointing to the database container on port `1433`. Integrates Apple Silicon and Intel macOS driver path fallbacks.
*   **[charts.py](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/backend/charts.py)**: Renders quick branch placements and skill frequency using matplotlib.
*   **[reports.py](file:///Users/pankajsagar/Desktop/collage-placement-Analytics-system/backend/reports.py)**: Displays tabular prints of SQL outputs using Pandas dataframes.
