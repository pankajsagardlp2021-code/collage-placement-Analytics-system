from flask import Flask, jsonify
from flask_cors import CORS
from db_connection import get_connection
import decimal

app = Flask(__name__)
# Enable CORS for frontend API fetch calls
CORS(app)

# Helper function to convert decimal values to float for JSON compatibility
def decimal_to_float(val):
    if isinstance(val, decimal.Decimal):
        return float(val)
    return val

# Standard KPI routes (requested by user and existing system)
@app.route("/total-students")
def total_students():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        total = cursor.execute("SELECT COUNT(*) FROM Students").fetchone()[0]
        return jsonify({"total_students": total})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route("/total-placements")
def total_placements():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # Only count Placed records (exclude rejected ones)
        total = cursor.execute("SELECT COUNT(*) FROM Placements WHERE Status = 'Placed'").fetchone()[0]
        return jsonify({"total_placements": total})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route("/highest-package")
def highest_package():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        highest = cursor.execute("SELECT MAX(Package) FROM Companies").fetchone()[0]
        return jsonify({"highest_package": decimal_to_float(highest)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route("/placement-percentage")
def placement_percentage():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        total_students = cursor.execute("SELECT COUNT(*) FROM Students").fetchone()[0]
        placed_students = cursor.execute("SELECT COUNT(*) FROM Placements WHERE Status = 'Placed'").fetchone()[0]
        percentage = round((placed_students / total_students) * 100, 2) if total_students > 0 else 0.0
        return jsonify({"placement_percentage": percentage})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ----------------------------------------------------
# 1. API FOR KPIS (Unified Object)
# ----------------------------------------------------
@app.route("/api/kpis")
def api_kpis():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        total_students = cursor.execute("SELECT COUNT(*) FROM Students").fetchone()[0]
        total_companies = cursor.execute("SELECT COUNT(*) FROM Companies").fetchone()[0]
        placed_students = cursor.execute("SELECT COUNT(*) FROM Placements WHERE Status = 'Placed'").fetchone()[0]
        highest_pkg = cursor.execute("SELECT MAX(Package) FROM Companies").fetchone()[0]
        percentage = round((placed_students / total_students) * 100, 2) if total_students > 0 else 0.0
        
        return jsonify({
            "totalStudents": total_students,
            "totalCompanies": total_companies,
            "placedStudents": placed_students,
            "highestPackage": decimal_to_float(highest_pkg),
            "placementPercentage": percentage
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ----------------------------------------------------
# 2. STUDENT DIRECTORY API
# ----------------------------------------------------
@app.route("/api/students")
def api_students():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Fetch students
        cursor.execute("SELECT StudentID, StudentName, Branch, CGPA FROM Students")
        students_rows = cursor.fetchall()
        
        # Fetch placements status mapping
        cursor.execute("SELECT StudentID, Status FROM Placements")
        placements_map = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Fetch skills mapping
        cursor.execute("""
            SELECT ss.StudentID, s.SkillName
            FROM StudentSkills ss
            JOIN Skills s ON ss.SkillID = s.SkillID
        """)
        skills_map = {}
        for row in cursor.fetchall():
            s_id, skill_name = row[0], row[1]
            if s_id not in skills_map:
                skills_map[s_id] = []
            skills_map[s_id].append(skill_name)
            
        students_list = []
        for row in students_rows:
            s_id = row[0]
            # Construct a roll number: 2026 + Branch + ID padded to 2 digits
            branch = row[2]
            roll_no = f"2026{branch}{str(s_id).zfill(2)}"
            
            # Map placement status (Placed, Rejected, In Progress)
            status = placements_map.get(s_id, "In Progress")
            
            students_list.append({
                "id": s_id,
                "name": row[1],
                "rollNo": roll_no,
                "branch": branch,
                "gpa": decimal_to_float(row[3]),
                "email": f"{row[1].lower().replace(' ', '.')}@college.edu",
                "skills": skills_map.get(s_id, []),
                "status": status
            })
            
        return jsonify(students_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ----------------------------------------------------
# 3. COMPANIES DIRECTORY API
# ----------------------------------------------------
@app.route("/api/companies")
def api_companies():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Fetch companies
        cursor.execute("SELECT CompanyID, CompanyName, Package FROM Companies")
        companies_rows = cursor.fetchall()
        
        # Fetch dynamic hiring count
        cursor.execute("""
            SELECT CompanyID, COUNT(*) 
            FROM Placements 
            WHERE Status = 'Placed' 
            GROUP BY CompanyID
        """)
        hired_map = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Color and metadata mapping to keep styling premium
        company_meta = {
            "TCS": {"logo": "fa-solid fa-square-poll-vertical", "color": "#1e3a8a", "industry": "IT Services", "minGpa": 6.5},
            "Infosys": {"logo": "fa-solid fa-desktop", "color": "#0369a1", "industry": "IT Consulting", "minGpa": 6.8},
            "Wipro": {"logo": "fa-solid fa-network-wired", "color": "#0f766e", "industry": "IT Services", "minGpa": 6.5},
            "Accenture": {"logo": "fa-solid fa-chart-line", "color": "#7e22ce", "industry": "Management Consulting", "minGpa": 7.0},
            "Cognizant": {"logo": "fa-solid fa-gears", "color": "#be185d", "industry": "IT Services", "minGpa": 6.8},
            "Capgemini": {"logo": "fa-solid fa-project-diagram", "color": "#0369a1", "industry": "Technology Services", "minGpa": 6.8},
            "HCL": {"logo": "fa-solid fa-microchip", "color": "#0284c7", "industry": "Hardware & Software", "minGpa": 6.5},
            "IBM": {"logo": "fa-solid fa-server", "color": "#1d4ed8", "industry": "Enterprise Systems", "minGpa": 7.2},
            "Amazon": {"logo": "fa-brands fa-amazon", "color": "#ea580c", "industry": "E-Commerce & Cloud", "minGpa": 8.5},
            "Google": {"logo": "fa-brands fa-google", "color": "#db4437", "industry": "Search & Tech", "minGpa": 8.8}
        }
        
        companies_list = []
        for row in companies_rows:
            c_id = row[0]
            name = row[1]
            package = decimal_to_float(row[2])
            meta = company_meta.get(name, {"logo": "fa-solid fa-briefcase", "color": "#475569", "industry": "Technology", "minGpa": 6.0})
            
            companies_list.append({
                "id": c_id,
                "name": name,
                "package": package,
                "logo": meta["logo"],
                "color": meta["color"],
                "industry": meta["industry"],
                "minGpa": meta["minGpa"],
                "hiredCount": hired_map.get(c_id, 0)
            })
            
        return jsonify(companies_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ----------------------------------------------------
# 4. PLACEMENT LOGS API
# ----------------------------------------------------
@app.route("/api/placements")
def api_placements():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT p.PlacementID, s.StudentID, s.StudentName, s.Branch, 
                   c.CompanyID, c.CompanyName, c.Package, p.Status, p.PlacementDate
            FROM Placements p
            JOIN Students s ON p.StudentID = s.StudentID
            JOIN Companies c ON p.CompanyID = c.CompanyID
            ORDER BY p.PlacementDate DESC
        """)
        rows = cursor.fetchall()
        
        placements_list = []
        for row in rows:
            placements_list.append({
                "id": row[0],
                "studentId": row[1],
                "studentName": row[2],
                "branch": row[3],
                "companyId": row[4],
                "companyName": row[5],
                "package": decimal_to_float(row[6]),
                "status": row[7],
                "date": str(row[8])
            })
            
        return jsonify(placements_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ----------------------------------------------------
# 5. CHART ANALYTICS API
# ----------------------------------------------------
@app.route("/api/analytics")
def api_analytics():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # 1. Branch Wise Placement counts
        cursor.execute("""
            SELECT s.Branch, COUNT(*)
            FROM Placements p
            JOIN Students s ON p.StudentID = s.StudentID
            WHERE p.Status = 'Placed'
            GROUP BY s.Branch
        """)
        branch_placements = {row[0]: row[1] for row in cursor.fetchall()}
        # Ensure all branches are present
        for branch in ["CSE", "IT", "ECE", "ME"]:
            if branch not in branch_placements:
                branch_placements[branch] = 0
                
        # 2. Company Wise Hiring counts
        cursor.execute("""
            SELECT c.CompanyName, COUNT(*)
            FROM Placements p
            JOIN Companies c ON p.CompanyID = c.CompanyID
            WHERE p.Status = 'Placed'
            GROUP BY c.CompanyName
        """)
        company_hiring = {row[0]: row[1] for row in cursor.fetchall()}
        # Ensure all 10 companies are present in dictionary
        cursor.execute("SELECT CompanyName FROM Companies")
        all_companies = [r[0] for r in cursor.fetchall()]
        for comp in all_companies:
            if comp not in company_hiring:
                company_hiring[comp] = 0

        # 3. Selected vs Rejected counts
        cursor.execute("""
            SELECT Status, COUNT(*)
            FROM Placements
            GROUP BY Status
        """)
        selection_ratio = {row[0]: row[1] for row in cursor.fetchall()}
        for status in ["Placed", "Rejected"]:
            if status not in selection_ratio:
                selection_ratio[status] = 0

        # 4. Skill distribution counts
        cursor.execute("""
            SELECT s.SkillName, COUNT(*)
            FROM StudentSkills ss
            JOIN Skills s ON ss.SkillID = s.SkillID
            GROUP BY s.SkillName
        """)
        skill_distribution = {row[0]: row[1] for row in cursor.fetchall()}
        
        return jsonify({
            "branchPlacements": branch_placements,
            "companyHiring": company_hiring,
            "selectionRatio": selection_ratio,
            "skillDistribution": skill_distribution
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5001)