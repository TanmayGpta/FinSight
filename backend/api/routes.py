from fastapi import APIRouter, Query
from mysql.connector import connect
from datetime import datetime, timedelta
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

        # --------- 1. Total Disbursed, Collected, Active Loans (All-Time) ---------
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
        if branch:
            total_query += " WHERE SUBSTRING_INDEX(o.name, ':', -1) = %s"
            cursor.execute(total_query, (branch.strip(),))
        else:
            cursor.execute(total_query)

        total_result = cursor.fetchone()
        total_disbursed = total_result["total_disbursed"] or 0
        total_collected = total_result["total_collected"] or 0
        active_loans = total_result["active_loans"]

        # --------- 2. Collection Rate (Till June 30) ---------
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
        collection_rate = round((collected_till_june / expected_till_june) * 100, 2) if expected_till_june else 0.0

        # --------- 3. New Customers (June + % change from May) ---------
        today = datetime.today()
        first_of_this_month = datetime(today.year, today.month, 1)
        last_month_end = first_of_this_month - timedelta(days=1)
        last_month_start = datetime(last_month_end.year, last_month_end.month, 1)
        prev_month_end = last_month_start - timedelta(days=1)
        prev_month_start = datetime(prev_month_end.year, prev_month_end.month, 1)

        # Base query: clients whose first loan was in this window
        base_new_customer_query = """
        SELECT COUNT(DISTINCT c.id) AS count
        FROM loan l
        JOIN client c ON l.client_id = c.id
        JOIN office o ON c.office_id = o.id
        WHERE l.approvedon_date >= %s AND l.approvedon_date < %s
          AND l.approvedon_date = (
              SELECT MIN(l2.approvedon_date)
              FROM loan l2
              WHERE l2.client_id = c.id
          )
        """

        # --- June ---
        june_params = [last_month_start, first_of_this_month]
        if branch:
            base_new_customer_query += " AND SUBSTRING_INDEX(o.name, ':', -1) = %s"
            june_params.append(branch.strip())

        cursor.execute(base_new_customer_query, june_params)
        new_customers = cursor.fetchone()["count"]

        # --- May ---
        may_params = [prev_month_start, last_month_start]
        if branch:
            may_params.append(branch.strip())  # branch already added in base query

        cursor.execute(base_new_customer_query, may_params)
        prev_customers = cursor.fetchone()["count"]

        # Compute % change safely
        if prev_customers:
            customer_change = round(((new_customers - prev_customers) / prev_customers) * 100, 2)
        else:
            customer_change = None

        # --------- 4. Average Loan Per Customer (All Time) ---------
        avg_loan_query = """
        SELECT SUM(lr.principal_amount) AS total_disbursed, COUNT(DISTINCT c.id) AS total_customers
        FROM loan_repayment lr
        JOIN loan l ON lr.loan_id = l.id
        JOIN client c ON l.client_id = c.id
        JOIN office o ON c.office_id = o.id
        """
        if branch:
            avg_loan_query += " WHERE SUBSTRING_INDEX(o.name, ':', -1) = %s"
            cursor.execute(avg_loan_query, (branch.strip(),))
        else:
            cursor.execute(avg_loan_query)

        avg_loan_result = cursor.fetchone()
        avg_loan = round(
            (avg_loan_result["total_disbursed"] or 0) / (avg_loan_result["total_customers"] or 1), 2
        )

        # --------- 5. Zonal Head Info ---------
        kpis = {
            "total_disbursed": total_disbursed,
            "total_collected": total_collected,
            "collection_rate": collection_rate,
            "active_loans": active_loans,
            "average_loan_per_customer": avg_loan,
            "new_customers": new_customers,
            "new_customers_change_pct": customer_change
        }

        if branch:
            cursor.execute("SELECT Zonal_Head FROM org WHERE SUBSTRING_INDEX(Branch, ':', -1) = %s", (branch.strip(),))
            org_result = cursor.fetchone()
            kpis["branch_name"] = branch.strip()
            kpis["zonal_head"] = org_result["Zonal_Head"] if org_result else None

        cursor.close()
        conn.close()
        return kpis

    except Exception as e:
        return {"error": str(e)}
    
@router.get("/api/delinquency")
def get_delinquency(branch: str = Query(None)):
    try:
        conn = connect(
            host="localhost",
            user="root",
            password="BtKQ@448",
            database="FinSight"
        )
        cursor = conn.cursor(dictionary=True)

        # Step 1: Get max dpd_days to scale
        scale_query = "SELECT MAX(dpd_days) AS max_dpd FROM arrears WHERE dpd_days IS NOT NULL"
        cursor.execute(scale_query)
        max_dpd = cursor.fetchone()["max_dpd"] or 1
        scale_factor = 90 / max_dpd if max_dpd > 90 else 1

        # Step 2: Get delinquent customers (grouped into scaled buckets)
        delinquency_query = f"""
        SELECT
            CASE
                WHEN ROUND(a.dpd_days * {scale_factor}) BETWEEN 1 AND 30 THEN '1-30 Days'
                WHEN ROUND(a.dpd_days * {scale_factor}) BETWEEN 31 AND 60 THEN '31-60 Days'
                ELSE '60+ Days'
            END AS bucket,
            COUNT(DISTINCT c.id) AS customer_count
        FROM arrears a
        JOIN client c ON a.loan_id = c.id
        JOIN office o ON c.office_id = o.id
        WHERE a.dpd_days > 0
        """

        params = []
        if branch:
            delinquency_query += " AND SUBSTRING_INDEX(o.name, ':', -1) = %s"
            params.append(branch.strip())

        delinquency_query += " GROUP BY bucket"
        cursor.execute(delinquency_query, params)
        bucket_results = cursor.fetchall()

        # Step 3: Get total clients (filtered by branch if needed)
        total_clients_query = """
        SELECT COUNT(DISTINCT c.id) AS total
        FROM client c
        JOIN office o ON c.office_id = o.id
        """
        if branch:
            total_clients_query += " WHERE SUBSTRING_INDEX(o.name, ':', -1) = %s"
            cursor.execute(total_clients_query, (branch.strip(),))
        else:
            cursor.execute(total_clients_query)
        total_clients = cursor.fetchone()["total"]

        # Step 4: Get delinquent client IDs
        delinquent_ids_query = """
        SELECT DISTINCT c.id
        FROM arrears a
        JOIN client c ON a.loan_id = c.id
        JOIN office o ON c.office_id = o.id
        WHERE a.dpd_days > 0
        """
        if branch:
            delinquent_ids_query += " AND SUBSTRING_INDEX(o.name, ':', -1) = %s"
            cursor.execute(delinquent_ids_query, (branch.strip(),))
        else:
            cursor.execute(delinquent_ids_query)

        delinquent_ids = {row["id"] for row in cursor.fetchall()}
        delinquent_count = len(delinquent_ids)

        # Step 5: Current = total clients - delinquent clients
        current_count = max(total_clients - delinquent_count, 0)

        # Build final data array
        total_with_current = current_count + sum(b["customer_count"] for b in bucket_results)

        color_map = {
            "Current": "#059669",
            "1-30 Days": "#f59e0b",
            "31-60 Days": "#ef4444",
            "60+ Days": "#dc2626"
        }

        data = [
            {
                "name": "Current",
                "value": round((current_count / total_with_current) * 100, 1) if total_with_current else 0.0,
                "count": current_count,
                "color": color_map["Current"]
            }
        ]

        for b in bucket_results:
            data.append({
                "name": b["bucket"],
                "value": round((b["customer_count"] / total_with_current) * 100, 1) if total_with_current else 0.0,
                "count": b["customer_count"],
                "color": color_map[b["bucket"]]
            })

        cursor.close()
        conn.close()
        return data
    

    except Exception as e:
        return {"error": str(e)}
    
@router.get("/api/branches")
def get_branches():
    try:
        conn = connect(
            host="localhost",
            user="root",
            password="BtKQ@448",
            database="FinSight"
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT DISTINCT SUBSTRING_INDEX(Branch, ':', -1) AS branch, Zonal_Head as zonal_head FROM org")
        return cursor.fetchall()
    except Exception as e:
        return {"error": str(e)}


