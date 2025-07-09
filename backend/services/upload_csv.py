import os
import mysql.connector
import pandas as pd

# Base setup
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
DATA_DIR = os.path.join(BASE_DIR, "data")

# MySQL connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="BtKQ@448",
    database="FinSight"
)
cursor = conn.cursor()

# Date columns to handle
date_cols = [
    'fromdate', 'duedate', 'created_date', 'lastmodified_date', 'emi_cleared_on',
    'submittedon_date', 'approvedon_date', 'activation_date', 'closedon_date',
    'calculated_maturedon_date', 'opening_date', 'overdue_since_date_derived','date_of_birth','submittedon_date',
    'office_joining_date','reactivated_on_date'
]

# Optional: Preload loan ids for foreign key validation
cursor.execute("SELECT id FROM loan")
valid_loan_ids = set(row[0] for row in cursor.fetchall())

def insert_csv_to_table(file_name, table_name, columns, is_excel=False):
    file_path = os.path.join(DATA_DIR, file_name)

    # Load file
    df = pd.read_excel(file_path) if is_excel else pd.read_csv(file_path)

    # Clean data
    df.columns = df.columns.str.strip()  # Strip column names
    df = df.where(pd.notnull(df), None)  # Replace NaNs with None
    df = df.replace({pd.NA: None, 'nan': None, 'NaN': None, 'NAN': None, '': None})

    # Format date columns
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce', dayfirst=True).dt.strftime('%Y-%m-%d')
            df[col] = df[col].where(pd.notnull(df[col]), None)

    # Insert rows
    # Insert rows
    for index, row in df.iterrows():
        try:
            values = tuple(
                None if pd.isna(row[col]) or str(row[col]).lower() == "nan"
                else row[col].item() if hasattr(row[col], "item") else row[col]
                for col in columns
            )
            placeholders = ','.join(['%s'] * len(columns))
            cursor.execute(
                f"INSERT INTO {table_name} ({','.join(columns)}) VALUES ({placeholders})",
                values
            )
        except Exception as e:
            print(f"❌ Error inserting row {index + 1} in {table_name}: {e}")


    conn.commit()
    print(f"✅ {len(df)} rows attempted in `{table_name}` from {file_name}.")

# 📥 List of files to load
load_tasks = [
    # {
    #     "file": "new_group.csv",
    #     "table": "group_",
    #     "columns": [
    #         "id", "status_enum", "activation_date", "office_id",
    #         "staff_id", "display_name", "hierarchy",
    #         "closedon_date", "account_no", "version"
    #     ]
    # },
    # {
    #     "file": "new_loan.csv",
    #     "table": "loan",
    #     "columns": [
    #         "id", "account_no", "client_id", "group_id", "product_id", "loan_officer_id",
    #         "principal_amount_proposed", "approved_principal", "annual_nominal_interest_rate",
    #         "number_of_repayments", "submittedon_date", "approvedon_date", "principal_disbursed_derived",
    #         "principal_outstanding_derived", "interest_charged_derived", "interest_outstanding_derived",
    #         "fee_charges_charged_derived", "total_expected_repayment_derived",
    #         "total_outstanding_derived", "fixed_emi_amount", "broken_period_interest",
    #         "calculated_maturedon_date"
    #     ]
    # },
    # {
    #     "file": "new_client.csv",
    #     "table": "client",
    #     "columns": [
    #         "id", "account_no", "office_joining_date", "office_id", "staff_id",
    #         "display_name", "date_of_birth", "submittedon_date", "activatedon_userid",
    #         "closedon_userid", "client_classification_cv_id", "reactivated_on_date",
    #         "reactivated_on_userid"
    #     ]
    # },

    # {
    #     "file": "new_loan_repayment.csv",
    #     "table": "loan_repayment",
    #     "columns": [
    #         "id", "loan_id", "fromdate", "duedate", "installment", "principal_amount",
    #         "principal_completed_derived", "interest_amount", "interest_completed_derived",
    #         "completed_derived", "createdby_id", "created_date", "lastmodifiedby_id",
    #         "lastmodified_date", "emi_cleared_on"
    #     ]
    # },
    # {
    #     "file": "new_ORG.xlsx",
    #     "table": "org",
    #     "columns": [
    #         "zone", "branch", "branch_name", "zonal_head", "cm_id",
    #         "circle_manager", "actual_state", "zh_id"
    #     ],
    #     "is_excel": True
    # },
    # {
    #     "file": "new_office.csv",
    #     "table": "office",
    #     "columns": [
    #         "id", "hierarchy", "name", "opening_date",
    #         "bm_staff_id", "activation_date", "activatedby_userid", "version"
    #     ]
    # },
    # {
    #     "file": "cleaned_arrears.csv",
    #     "table": "arrears",
    #     "columns": [
    #         "loan_id", "principal_overdue_derived", "interest_overdue_derived",
    #         "fee_charges_overdue_derived", "penalty_charges_overdue_derived",
    #         "total_overdue_derived", "overdue_since_date_derived", "dpd_days"
    #     ]
    # },
]

# 🔁 Load all files
for task in load_tasks:
    insert_csv_to_table(
        file_name=task["file"],
        table_name=task["table"],
        columns=task["columns"],
        is_excel=task.get("is_excel", False)
    )

# Cleanup
cursor.close()
conn.close()

