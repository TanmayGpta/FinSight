from fastapi import APIRouter, Query
from mysql.connector import connect
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from .auth import get_current_user
from typing import Optional
from fastapi import Query
import pickle
import pandas as pd
from prophet import Prophet
from ai_modules.advisor_engine import load_rules, run_inference_engine
from ai_modules.route_optimizer import optimize_route_greedy, generate_mock_coordinates

router = APIRouter()

# --- CONFIG ---
GOOGLE_MAPS_API_KEY = 'AIzaSyDTlQ77xLDt5noMuczG8mrhoWr5vDLd7-g'

# ==========================================
# 1. BASIC DATA ROUTES (KPIs, Login, Auth)
# ==========================================

@router.get("/kpis")
def get_kpis(
    user=Depends(get_current_user),
    branch: Optional[str] = Query(None)
):
    # ... (Existing KPI Logic, requires auth) ...
    if user["role"] != "admin":
        branch = user["branch"]

    try:
        conn = connect(
            host="localhost",
            user="root",
            password="BtKQ@448",
            database="FinSight"
        )
        cursor = conn.cursor(dictionary=True)

        # --- 1. Totals ---
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

        # --- 2. Collection Rate till June 30 ---
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

        # --- 3. New Customers (June vs May) ---
        today = datetime.today()
        first_of_this_month = datetime(today.year, today.month, 1)
        last_month_end = first_of_this_month - timedelta(days=1)
        last_month_start = datetime(last_month_end.year, last_month_end.month, 1)
        prev_month_end = last_month_start - timedelta(days=1)
        prev_month_start = datetime(prev_month_end.year, prev_month_end.month, 1)

        base_query = """
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
        june_params = [last_month_start, first_of_this_month]
        if branch:
            base_query += " AND SUBSTRING_INDEX(o.name, ':', -1) = %s"
            june_params.append(branch.strip())
        cursor.execute(base_query, june_params)
        new_customers = cursor.fetchone()["count"]

        may_params = [prev_month_start, last_month_start]
        if branch:
            may_params.append(branch.strip())
        cursor.execute(base_query, may_params)
        prev_customers = cursor.fetchone()["count"]

        customer_change = (
            round(((new_customers - prev_customers) / prev_customers) * 100, 2)
            if prev_customers else None
        )

        # --- 4. Avg Loan Per Customer ---
        avg_query = """
        SELECT SUM(lr.principal_amount) AS total_disbursed, COUNT(DISTINCT c.id) AS total_customers
        FROM loan_repayment lr
        JOIN loan l ON lr.loan_id = l.id
        JOIN client c ON l.client_id = c.id
        JOIN office o ON c.office_id = o.id
        """
        if branch:
            avg_query += " WHERE SUBSTRING_INDEX(o.name, ':', -1) = %s"
            cursor.execute(avg_query, (branch.strip(),))
        else:
            cursor.execute(avg_query)

        avg_result = cursor.fetchone()
        avg_loan = round((avg_result["total_disbursed"] or 0) / (avg_result["total_customers"] or 1), 2)

        # --- 5. Zonal Head (if applicable) ---
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

@router.get("/delinquency")
def get_delinquency(user=Depends(get_current_user)):
    # ... (delinquency logic) ...
    branch = user["branch"] if user["role"] != "admin" else None
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

@router.get("/branches")
def get_branches():
    # ... (branches logic) ...
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

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # ... (login logic) ...
    conn = connect(host="localhost", user="root", password="BtKQ@448", database="FinSight")
    cursor = conn.cursor(dictionary=True)
    query = """
    SELECT SUBSTRING_INDEX(Branch, ':', -1) AS branch, Zonal_Head as zonal_head
    FROM org
    WHERE Zonal_Head = %s AND SUBSTRING_INDEX(Branch, ':', -1) = %s
    """
    cursor.execute(query, (form_data.username, form_data.password))
    result = cursor.fetchone()

    if not result:
        if form_data.username == "admin" and form_data.password == "admin123":
            result = {"zonal_head": "admin", "branch": None}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "sub": result["zonal_head"],
        "role": "admin" if result["zonal_head"] == "admin" else "zonal_head",
        "branch": result["branch"],
        "exp": datetime.utcnow() + timedelta(hours=12)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


# ==========================================
# 2. FORECASTING ROUTES (Learning Module)
# ==========================================

try:
    with open("models/disbursement_forecast_model.pkl", "rb") as f:
        model_disbursement = pickle.load(f)
    with open("models/collections_forecast_model.pkl", "rb") as f:
        model_collections = pickle.load(f)
    with open("models/growth_forecast_model.pkl", "rb") as f:
        model_growth = pickle.load(f)
    print("AI forecast models loaded successfully.")
except Exception as e:
    print(f"CRITICAL ERROR: Could not load AI models. {e}")
    model_disbursement = None
    model_collections = None
    model_growth = None

@router.get("/forecast/disbursement")
def get_disbursement_forecast(branch: str):
    # ... (forecast logic) ...
    if not model_disbursement:
        raise HTTPException(status_code=500, detail="Disbursement model is not available.")
    
    print(f"Generating disbursement forecast for: {branch}")
    future = model_disbursement.make_future_dataframe(periods=12, freq='W')
    future['floor'] = 0
    future['cap'] = 1305000.0

    forecast = model_disbursement.predict(future)
    hist_df = model_disbursement.history.copy()
    hist_df['date'] = pd.to_datetime(hist_df['ds'])
    
    historical_data = []
    for _, row in hist_df.iterrows():
        historical_data.append({
            "month": row['date'].strftime('%b %Y'),
            "actual": row['y'],
            "predicted": None
        })

    last_hist_date = hist_df['date'].max()
    fcst_df = forecast[forecast['ds'] > last_hist_date].copy()
    
    forecast_data = []
    for _, row in fcst_df.iterrows():
        forecast_data.append({
            "month": row['ds'].strftime('%b %Y'),
            "actual": None,
            "predicted": row['yhat'],
            "confidence_low": row['yhat_lower'],
            "confidence_high": row['yhat_upper']
        })
    
    return {
        "branch": branch,
        "historical": historical_data,
        "forecast": forecast_data
    }

@router.get("/forecast/collections")
def get_collections_forecast(branch: str):
    # ... (forecast logic) ...
    if not model_collections:
        raise HTTPException(status_code=500, detail="Collections forecast model is not available.")

    print(f"Generating collections forecast for: {branch}")
    future = model_collections.make_future_dataframe(periods=12, freq='W')
    future['floor'] = 0.0
    future['cap'] = 130000.0

    forecast = model_collections.predict(future)

    hist_df = model_collections.history.copy()
    hist_df['date'] = pd.to_datetime(hist_df['ds'])
    
    historical_data = []
    for _, row in hist_df.iterrows():
        historical_data.append({
            "month": row['date'].strftime('%b %Y'),
            "actual": row['y'],
            "predicted": None
        })

    last_hist_date = hist_df['date'].max()
    fcst_df = forecast[forecast['ds'] > last_hist_date].copy()
    
    forecast_data = []
    for _, row in fcst_df.iterrows():
        forecast_data.append({
            "month": row['ds'].strftime('%b %Y'),
            "actual": None,
            "predicted": row['yhat'],
            "confidence_low": row['yhat_lower'],
            "confidence_high": row['yhat_upper']
        })
    
    return {
        "branch": branch,
        "historical": historical_data,
        "forecast": forecast_data
    }

@router.get("/forecast/growth")
def get_growth_forecast(branch: str):
    # ... (forecast logic) ...
    if not model_growth:
        raise HTTPException(status_code=500, detail="Customer growth model is not available.")
        
    print(f"Generating customer growth forecast for: {branch}")
    future = model_growth.make_future_dataframe(periods=90, freq='D')
    future['floor'] = 1.0
    future['cap'] = 250.5

    forecast = model_growth.predict(future)

    hist_df = model_growth.history.copy()
    hist_df['date'] = pd.to_datetime(hist_df['ds'])
    
    historical_data = []
    for _, row in hist_df.iterrows():
        historical_data.append({
            "month": row['date'].strftime('%b %Y'),
            "actual": row['y'],
            "predicted": None
        })

    last_hist_date = hist_df['date'].max()
    fcst_df = forecast[forecast['ds'] > last_hist_date].copy()
    
    forecast_data = []
    for _, row in fcst_df.iterrows():
        forecast_data.append({
            "month": row['ds'].strftime('%b %Y'),
            "actual": None,
            "predicted": row['yhat'],
            "confidence_low": row['yhat_lower'],
            "confidence_high": row['yhat_upper']
        })
    
    return {
        "branch": branch,
        "historical": historical_data,
        "forecast": forecast_data
    }


# ==========================================
# 3. ADVISOR ROUTES (Reasoning Module)
# ==========================================

try:
    all_rules = load_rules("ai_modules/rules.json")
    print(f"AI Advisor rules ({len(all_rules)} rules) loaded successfully.")
except Exception as e:
    print(f"CRITICAL ERROR: Could not load AI rules. {e}")
    all_rules = []

# --- FIX: TRULY ANONYMOUS ROUTE ---
@router.get("/advisor")
def get_ai_advisor_insights(branch: Optional[str] = Query(None)): 
    if not all_rules:
        raise HTTPException(status_code=500, detail="AI Advisor engine is not available.")

    facts = {}
    try:
        conn = connect(host="localhost", user="root", password="BtKQ@448", database="FinSight")
        cursor = conn.cursor(dictionary=True)

        # Fact gathering queries...
        last_30_days = datetime.now() - timedelta(days=30)
        rate_query = """
            SELECT SUM(lr.principal_completed_derived) / SUM(lr.principal_amount) * 100 AS rate
            FROM loan_repayment lr
            JOIN loan l ON lr.loan_id = l.id
            JOIN client c ON l.client_id = c.id
            JOIN office o ON c.office_id = o.id
            WHERE lr.duedate >= %s
        """
        rate_params = [last_30_days]
        if branch:
            rate_query += " AND SUBSTRING_INDEX(o.name, ':', -1) = %s"
            rate_params.append(branch.strip())
        
        cursor.execute(rate_query, rate_params)
        rate_result = cursor.fetchone()
        facts["branch_collection_rate_30d"] = rate_result['rate'] or 100

        first_of_this_month = datetime.today().replace(day=1)
        last_month_start = (first_of_this_month - timedelta(days=1)).replace(day=1)
        growth_query = """
            SELECT COUNT(DISTINCT c.id) AS count
            FROM loan l
            JOIN client c ON l.client_id = c.id
            JOIN office o ON c.office_id = o.id
            WHERE l.approvedon_date >= %s AND l.approvedon_date < %s
        """
        growth_params = [last_month_start, first_of_this_month]
        if branch:
            growth_query += " AND SUBSTRING_INDEX(o.name, ':', -1) = %s"
            growth_params.append(branch.strip())

        cursor.execute(growth_query, growth_params)
        facts["customer_growth_30d"] = cursor.fetchone()['count'] or 0
        
        par_query = """
            SELECT 
                SUM(CASE WHEN a.dpd_days > 30 THEN a.total_overdue_derived ELSE 0 END) / 
                SUM(l.principal_disbursed_derived) * 100 AS par_percent
            FROM loan l
            LEFT JOIN arrears a ON l.id = a.loan_id
            JOIN client c ON l.client_id = c.id
            JOIN office o ON c.office_id = o.id
        """
        par_params = []
        if branch:
            par_query += " WHERE SUBSTRING_INDEX(o.name, ':', -1) = %s"
            par_params.append(branch.strip())
            
        cursor.execute(par_query, par_params)
        par_result = cursor.fetchone()
        facts["current_par_percent"] = par_result['par_percent'] or 0

        cursor.close()
        conn.close()

    except Exception as e:
        # If DB fails, at least provide fixed facts to run the logic
        facts["branch_collection_rate_30d"] = 80  # Default to failing rate
        facts["customer_growth_30d"] = 4         # Default to low growth
        facts["current_par_percent"] = 16.0       # Default to high risk
        print(f"Warning: DB connection failed ({e}). Using default facts for inference.")
        
    # Add forecast facts (which are static for this demo)
    facts["forecasted_collections_next_week"] = 85000 
    facts["forecasted_growth_next_month"] = 15 
    facts["client_risk_score"] = 0.85
    facts["loan_product_type"] = "New Business Loan"
    facts["client_current_dpd"] = 28 
    facts["applicant_cibil_score"] = 550
    
    print(f"Running AI Advisor for {branch} with facts: {facts}")
    recommendations = run_inference_engine(facts, all_rules)
    
    return {"recommendations": recommendations}


# ==========================================
# 4. PLANNING ROUTES (State Space Search)
# ==========================================

# --- ROUTE OPTIMIZER ENDPOINT (NO AUTH) ---
@router.get("/planning/route")
def get_optimized_route(
    branch: str,
    num_clients: int = 10
):
    # ... (route optimizer logic) ...
    try:
        branch_location = {"id": "BRANCH", "name": f"Branch {branch}", "lat": 23.1815, "lon": 85.3055}

        conn = connect(
            host="localhost",
            user="root",
            password="BtKQ@448",
            database="FinSight"
        )
        cursor = conn.cursor(dictionary=True)
        
        client_query = """
            SELECT c.id, c.display_name 
            FROM client c 
            JOIN office o ON c.office_id = o.id
            WHERE SUBSTRING_INDEX(o.name, ':', -1) = %s
            LIMIT %s
        """
        cursor.execute(client_query, (branch.strip(), num_clients))
        db_clients = cursor.fetchall()
        conn.close()

        if not db_clients:
            db_clients = [{"id": i, "display_name": f"Client {i}"} for i in range(num_clients)]

        mock_coords = generate_mock_coordinates(
            branch_location["lat"], 
            branch_location["lon"], 
            len(db_clients), 
            radius_km=5
        )

        clients_with_loc = []
        for i, client in enumerate(db_clients):
            clients_with_loc.append({
                "id": str(client["id"]),
                "name": client["display_name"],
                "lat": mock_coords[i]["lat"],
                "lon": mock_coords[i]["lon"]
            })

        # Run State-Space Search (Pass the API Key)
        result = optimize_route_greedy(
            branch_location, 
            clients_with_loc, 
            api_key=GOOGLE_MAPS_API_KEY
        )
        
        return result

    except Exception as e:
        print(f"Error planning route: {e}")
        return {"error": str(e)}