# main.py
# -----------------------------------------------
# 🚀 Purpose: Entry point of the FastAPI backend.
# Initializes FastAPI app and includes all API routes.
# Run this file using: uvicorn main:app --reload
# -----------------------------------------------
# 👇 Add this middleware to allow frontend access



from fastapi import FastAPI
from api.routes import router as financial_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="FinSight API",
    description="API for serving financial data from MySQL for FinSight project",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for full open access (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include financial data routes under /api
app.include_router(financial_router, prefix="/api")

# Root test endpoint
@app.get("/")
def read_root():
    return {"message": "FinSight backend is running!"}
