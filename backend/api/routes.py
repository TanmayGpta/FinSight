from fastapi import APIRouter
import mysql.connector

router = APIRouter()

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "BtKQ@448",
    "database": "FinSight"
}

@router.get("/financials")
def get_all_financial_data():
    try:
        print("🔌 Connecting to DB...")
        conn = mysql.connector.connect(**db_config)
        print("✅ Connected!")
        cursor = conn.cursor(dictionary=True)

        print("📊 Running query...")
        cursor.execute("SELECT * FROM financial_data")
        results = cursor.fetchall()

        cursor.close()
        conn.close()
        print("✅ Query completed!")

        return {"data": results}

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": str(e)}
