from fastapi import APIRouter, Query
from mysql.connector import connect
from datetime import datetime
import os

router = APIRouter()

@router.get("/api/kpis")
def get_kpis(branch: str = Query(None)):
    try:
        conn = connect(
            host="localhost",
            user="root",
            password="BtKQ@448",
            database="FinSight"
        )
        cursor = conn.cursor(dictionary=True)

        # Get total disbursed and collected (ALL TIME)
        total_query = """
        SELECT
            SUM(lr.principal_amount) AS total_disbursed,
            SUM(lr.principal_completed_derived) AS total_collected,
            COUNT(DISTINCT lr.loan_id) AS active_loans
        FROM loan_repayment lr
        JOIN loan l ON lr.loan_id = l.id
        JOIN client c ON l.client_id = c.id
        JOIN office o ON c.office_id = o.id
        """
        total_params = []
        if branch:
            total_query += " WHERE SUBSTRING_INDEX(o.name, ':', -1) = %s"
            total_params.append(branch.strip())

        cursor.execute(total_query, total_params)
        total_result = cursor.fetchone()
        total_disbursed = total_result["total_disbursed"] or 0
        total_collected = total_result["total_collected"] or 0
        active_loans = total_result["active_loans"]

        # Collection stats for EMIs due on or before June 30
        cutoff_date = datetime(datetime.now().year, 6, 30).strftime("%Y-%m-%d")
        rate_query = """
        SELECT
            SUM(lr.principal_amount) AS expected_till_june,
            SUM(lr.principal_completed_derived) AS collected_till_june
        FROM loan_repayment lr
        JOIN loan l ON lr.loan_id = l.id
        JOIN client c ON l.client_id = c.id
        JOIN office o ON c.office_id = o.id
        WHERE lr.duedate <= %s
        """
        rate_params = [cutoff_date]
        if branch:
            rate_query += " AND SUBSTRING_INDEX(o.name, ':', -1) = %s"
            rate_params.append(branch.strip())

        cursor.execute(rate_query, rate_params)
        rate_result = cursor.fetchone()
        expected_till_june = rate_result["expected_till_june"] or 0
        collected_till_june = rate_result["collected_till_june"] or 0

        # Safe calculation for collection rate
        collection_rate = round(
            (collected_till_june / expected_till_june) * 100, 2
        ) if expected_till_june else 0.0

        # Final KPIs response
        kpis = {
            "total_disbursed": total_disbursed,
            "total_collected": total_collected,
            "collection_rate": collection_rate,
            "active_loans": active_loans
        }

        # Add branch metadata if branch filter is used
        if branch:
            cursor.execute(
                "SELECT Zonal_Head FROM org WHERE SUBSTRING_INDEX(Branch, ':', -1) = %s",
                (branch.strip(),)
            )
            org_result = cursor.fetchone()
            kpis["branch_name"] = branch.strip()
            kpis["zonal_head"] = org_result["Zonal_Head"] if org_result else None

        cursor.close()
        conn.close()
        return kpis

    except Exception as e:
        return {"error": str(e)}
