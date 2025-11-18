# main.py
# -----------------------------------------------
# 🚀 Purpose: Entry point of the FastAPI backend.
# Initializes FastAPI app and includes all API routes.
# Run this file using: uvicorn main:app --reload --port 8080
# -----------------------------------------------

from fastapi import FastAPI
from api import routes as financial_router
from fastapi.middleware.cors import CORSMiddleware  # <-- 1. IMPORT THIS

app = FastAPI()

# --- 2. THIS IS THE FIX ---
# This middleware block tells the server to trust your React app
# Using ["*"] is a broad-strokes fix to get it working.
# For production, we'd go back to ["http://localhost:5173"]
origins = ["*"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# -----------------------------------------------

# Include financial data routes under /api
app.include_router(financial_router.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "FinSight AI API is running. Go to /docs for API documentation."}