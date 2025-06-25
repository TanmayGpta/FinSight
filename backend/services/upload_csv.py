import os
import mysql.connector
import csv

# Set up dynamic path to CSV file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))  # -> FinSight/
csv_path = os.path.join(BASE_DIR, "data", "updated_file.csv")

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="BtKQ@448",
    database="FinSight"
)
cursor = conn.cursor()

# Read and insert data from CSV
with open(csv_path, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        cursor.execute("""
            INSERT INTO financial_data (
                company_name, year, quarter,
                revenue, net_income, liabilities,
                assets, equity, roa, roe, debt_to_equity
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            row['Company'], int(row['year']), row['quarter'],
            float(row['Revenue']), float(row['Net Income']), float(row['Liabilities']),
            float(row['Assets']), float(row['Equity']), float(row['ROA (%)']),
            float(row['ROE (%)']), float(row['Debt to Equity'])

        ))

conn.commit()
cursor.close()
conn.close()

print("✅ Data inserted successfully from:", csv_path)
