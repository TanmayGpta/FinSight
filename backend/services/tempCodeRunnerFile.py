import pandas as pd

# Step 1: Load original Excel file
df = pd.read_excel('./backend/data/new_ORG.xlsx')

# Step 2: Rename columns
df.columns = [
    "zone","branch", "branch_name", "zonal_head",
    "cm_id", "circle_manager", "actual_state", "zh_id"
]

# Step 3: Save back to the same file (overwrite)
df.to_excel('./backend/data/new_ORG.xlsx', index=False)

print("✅ ORG.xlsx column names cleaned and file updated.")
