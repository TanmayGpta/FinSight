Progress You Can Show This Week:

For your upcoming meeting, you can confidently state that you have:
1.  Finalized the project's AI architecture and objectives.
2.  Begun **Phase 1 (Step 1.1)** by writing data extraction scripts to pull, clean, and pre-process historical data from your MySQL database, preparing it for machine learning.
3.  Started **Phase 2 (Step 2.1)** by defining the first set of production rules (e.g., 10-15 rules) for your knowledge base, capturing expert logic for risk assessment.



### **Detailed Project Plan: Integrating AI into FinSight**

Here is the breakdown, phase by phase, mapping directly to your four objectives.

#### **Phase 1: Predictive Analytics Core (Objective 1)** 📈
**Goal:** To build and integrate the ML models for forecasting and risk scoring.

* **Step 1.1: Data Engineering & Feature Selection (Immediate Task)**
    * **Action:** Write Python scripts (using Pandas) to connect to your existing MySQL database.
    * **Action:** Extract and clean historical data for (a) time-series forecasting (e.g., daily/weekly collection rates) and (b) client risk classification (client demographics, loan terms, payment history).
    * **Action:** Engineer new features, such as `payment_punctuality_score`, `loan_to_income_ratio`, or `days_since_last_missed_payment`.
    * **Output:** `train.csv` and `test.csv` files for your models.

* **Step 1.2: Model Development & Training (Local)**
    * **Action (Forecasting):** Experiment with models like **Prophet** or **SARIMA** on your time-series data. Your goal is a robust model that can predict collection rates for the next 30 days.
    * **Action (Risk Scoring):** Train a classification model (e.g., **Random Forest** or **XGBoost**) on your client data to predict the `default_probability` (a score from 0.0 to 1.0).
    * **Action:** Save (pickle) your two best-performing models (e.g., `forecasting_model.pkl` and `risk_classifier.pkl`).

* **Step 1.3: Backend API Integration (FastAPI)**
    * **Action:** Create two new endpoints in your existing FastAPI backend:
        * `POST /api/predict/risk`: Takes a new client's features as a JSON payload and returns the risk score from your loaded model.
        * `GET /api/forecast/collections`: Takes a branch name and a time horizon (e.g., `days=30`) and returns a JSON object with the forecasted data points.

* **Step 1.4: Frontend Visualization (React)**
    * **Action (Risk):** On your existing "Client Analytics" page, call the `/api/predict/risk` endpoint to display the new AI-powered risk score for each client.
    * **Action (Forecasting):** On your "Main Dashboard," use Recharts to plot the data from `/api/forecast/collections`, showing the historical trend as a solid line and the AI forecast as a dotted line.

---

#### **Phase 2: AI-Driven Decision Support (Objective 2)** 🧠
**Goal:** To build the rules engine and the route-planning search algorithm.

* **Step 2.1: Knowledge Base Development (Immediate Task)**
    * **Action:** Define the "expert knowledge" for your system. Start by writing 10-20 **IF-THEN rules** in a simple format, like a JSON file (`rules.json`).
    * **Example Rule:** `{"if": {"client_risk_score": "> 0.8", "loan_type": "Agriculture"}, "then": {"recommendation": "Reject - High Risk Sector", "action": "Trigger manual review"}}`

* **Step 2.2: Build the Reasoning Engine (FastAPI)**
    * **Action:** Create a new Python module (`reasoning_engine.py`) in your backend.
    * **Action:** This module will have a function that:
        1.  Loads the `rules.json` file.
        2.  Takes inputs (like the risk score from Phase 1 and new loan application data).
        3.  Applies the rules (simple forward chaining) to arrive at a final recommendation (e.g., "Approve," "Flag," "Reject").
    * **Action:** Create a new endpoint `/api/advice/loan_approval` that returns this recommendation *and* the list of rules that were triggered (this is key for Objective 4).

* **Step 2.3: Implement the Route Optimization Search (FastAPI)**
    * **Action:** Implement a search algorithm to solve the Traveling Salesperson Problem (TSP) for loan officers. The **A\* search algorithm** or a simpler **Nearest Neighbor heuristic** is a perfect choice.
    * **Action:** Create a new endpoint `/api/optimize/route`. This endpoint will take a `loan_officer_id`, fetch all their client locations for the day from the database, and return an *ordered list* of client IDs representing the most efficient route.

* **Step 2.4: Frontend Integration (React & @visx)**
    * **Action (Advice):** On the loan approval page, display the recommendation from `/api/advice/loan_approval`.
    * **Action (Routes):** On your existing "Regions Page" map, add a "Get Optimized Route" button. When clicked, it will call `/api/optimize/route` and then use your `@visx` library to draw the optimized path on the map, connecting the client locations in the correct sequence.

---

#### **Phase 3: Conversational Interface (Objective 3)** 💬
**Goal:** To build the chatbot that allows users to query data using natural language.

* **Step 3.1: Chatbot UI Development (React)**
    * **Action:** Build a new, reusable React component for the chat interface (a chat bubble, an input box, etc.).
    * **Action:** Add this component as a floating "Help" icon on your main dashboard.

* **Step 3.2: Natural Language to API Logic (FastAPI)**
    * **Action:** This is the core reasoning part. Create a new endpoint `/api/chat`.
    * **Action:** This endpoint will take the user's text (e.g., "What is the collection rate for the Agra branch?").
    * **Action:** It will use Natural Language Understanding (NLU) to:
        1.  **Identify Intent:** `get_kpi`
        2.  **Extract Entities:** `{"kpi": "collection_rate", "branch": "Agra"}`
    * **Action:** The backend will then *internally call its own existing API* (e.g., `/api/kpi/collection_rate?branch=Agra`) to get the real data.
    * *(**Pro-Tip:** You can start with simple `if-else` logic and keywords, then move to a library like **Rasa** or an **LLM API** for more advanced NLU).*

* **Step 3.3: Final Integration**
    * **Action:** The `/api/chat` endpoint formats the retrieved data into a friendly, natural language response (e.g., "The collection rate for the Agra branch is currently 92.5%.") and sends it back to the React chat component to be displayed.

---

#### **Phase 4: Explainable AI (XAI) & System Integration (Objective 4)** 🔍
**Goal:** To make the AI transparent and trustworthy by explaining *why* it makes its decisions.

* **Step 4.1: Explain the ML Model (FastAPI)**
    * **Action:** Use the **SHAP** library in your backend.
    * **Action:** Create a new endpoint `/api/explain/risk?client_id=123`.
    * **Action:** This endpoint will load your saved risk model, run a SHAP analysis for the specified client, and return the top 3-5 features that contributed to their score (e.g., `{"positive_factors": ["High Income"], "negative_factors": ["Missed 2 payments", "High debt ratio"]}`).

* **Step 4.2: Explain the Reasoning Engine (Frontend)**
    * **Action:** This is the easiest part because you already did the work in Step 2.2.
    * **Action:** When your UI displays a loan recommendation (e.g., "Flagged for Review"), it will also display the list of rules that were returned from the `/api/advice/loan_approval` endpoint.
    * **Action (Frontend):** You will simply render this list: "This decision was based on: `Rule 'High Risk Weather' triggered.`"

* **Step 4.3: Frontend UI for XAI**
    * **Action:** On the client page, next to the AI-generated risk score, add a small "Why?" button.
    * **Action:** When clicked, this button calls `/api/explain/risk` and displays the contributing factors in a simple, easy-to-understand pop-up. This directly demonstrates XAI to your professor.



    