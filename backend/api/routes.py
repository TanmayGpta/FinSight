# routes.py
# --------------------------------------------------
# Financial data API routes — with filter support
# --------------------------------------------------

from fastapi import APIRouter, Query
import mysql.connector
from typing import Optional

router = APIRouter()

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "BtKQ@448",
    "database": "FinSight"
}

@router.get("/financials")
def get_filtered_financial_data(
    company: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Base query
        query = "SELECT * FROM financial_data WHERE 1=1"
        params = []

        if company:
            query += " AND company_name = %s"
            params.append(company)

        if year:
            query += " AND year = %s"
            params.append(year)

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return {"data": results}

    except Exception as e:
        return {"error": str(e)}

@router.get("/summary")
def get_summary(
    company: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT 
                COUNT(*) AS total_entries,
                SUM(revenue) AS total_revenue,
                AVG(roa) AS avg_roa,
                AVG(roe) AS avg_roe,
                MAX(year) AS latest_year
            FROM financial_data
            WHERE 1=1
        """
        params = []

        if company:
            query += " AND company_name = %s"
            params.append(company)
        if year:
            query += " AND year = %s"
            params.append(year)

        cursor.execute(query, tuple(params))
        result = cursor.fetchone()

        cursor.close()
        conn.close()
        return {"summary": result}

    except Exception as e:
        return {"error": str(e)}


@router.get("/forecast")
def forecast_data():
    # Later you'll connect this to a model
    dummy_forecast = {
        "company": "Siemens AG",
        "year": 2025,
        "quarter": "Q1",
        "predicted_revenue": 153456789.23,
        "predicted_net_income": 13456789.00
    }
    return {"forecast": dummy_forecast}

@router.get("/companies")
def get_companies():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("SELECT DISTINCT company_name FROM financial_data ORDER BY company_name")
        results = [row[0] for row in cursor.fetchall()]

        cursor.close()
        conn.close()
        return {"companies": results}

    except Exception as e:
        return {"error": str(e)}

@router.get("/years")
def get_years():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("SELECT DISTINCT year FROM financial_data ORDER BY year")
        results = [row[0] for row in cursor.fetchall()]

        cursor.close()
        conn.close()
        return {"years": results}

    except Exception as e:
        return {"error": str(e)}
