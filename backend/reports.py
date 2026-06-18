import pyodbc
import pandas as pd

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost,1433;"
    "DATABASE=PlacementDB;"
    "UID=sa;"
    "PWD=Pankaj@1234;"
    "TrustServerCertificate=yes;"
)

query = """
SELECT
s.Branch,
COUNT(*) AS TotalPlaced
FROM Placements p
JOIN Students s
ON p.StudentID = s.StudentID
GROUP BY s.Branch
"""

df = pd.read_sql(query, conn)

print(df.head())