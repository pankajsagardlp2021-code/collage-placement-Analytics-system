import pyodbc
import os

def get_connection():
    # List of drivers and direct macOS library paths to try sequentially
    drivers_to_try = [
        "DRIVER={ODBC Driver 18 for SQL Server}",
        "DRIVER=/opt/homebrew/lib/libmsodbcsql.18.dylib",    # Homebrew Apple Silicon path
        "DRIVER=/usr/local/lib/libmsodbcsql.18.dylib",        # Homebrew Intel macOS path
        "DRIVER={ODBC Driver 17 for SQL Server}",
        "DRIVER=/opt/homebrew/lib/libmsodbcsql.17.dylib",
        "DRIVER=/usr/local/lib/libmsodbcsql.17.dylib"
    ]
    
    last_error = None
    for driver in drivers_to_try:
        try:
            conn = pyodbc.connect(
                f"{driver};"
                "SERVER=localhost,1433;"
                "DATABASE=PlacementDB;"
                "UID=sa;"
                "PWD=Pankaj@1234;"
                "TrustServerCertificate=yes;"
            )
            return conn
        except Exception as e:
            last_error = e
            continue
            
    raise Exception(f"Failed to connect to SQL Server database with any driver. Last error: {last_error}")