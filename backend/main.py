# main.py
# -----------------------------------------------
# 🚀 Purpose: Entry point of the FastAPI backend.
# Initializes FastAPI app and includes all API routes.
# Run this file using: uvicorn main:app --reload
# -----------------------------------------------

from fastapi import FastAPI
from api.routes import router as financial_router

app = FastAPI(
    title="FinSight API",
    description="API for serving financial data from MySQL for FinSight project",
    version="1.0.0"
)

# Include financial data routes under /api
app.include_router(financial_router, prefix="/api")

# Root test endpoint
@app.get("/")
def read_root():
    return {"message": "FinSight backend is running!"}
