import pyodbc
import pandas as pd
import matplotlib.pyplot as plt

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=PlacementDB;"
    "UID=sa;"
    "PWD=Pankaj@1234;"
    "TrustServerCertificate=yes;"
)
query = """
SELECT
s.SkillName,
COUNT(*) AS TotalStudents
FROM StudentSkills ss
JOIN Skills s
ON ss.SkillID = s.SkillID
GROUP BY s.SkillName
"""
df = pd.read_sql(query, conn)

plt.figure(figsize=(8,5))

plt.bar(df["SkillName"], df["TotalStudents"])

plt.title("Skill Distribution")
plt.xlabel("Skills")
plt.ylabel("Students")

plt.xticks(rotation=45)

plt.show()

df = pd.read_sql(query, conn)

plt.bar(df["Branch"], df["TotalPlaced"])
plt.title("Branch Wise Placement")
plt.xlabel("Branch")
plt.ylabel("Students Placed")
plt.show()