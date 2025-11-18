import json

def load_rules(filepath="rules.json"):
    """Loads the knowledge base from a JSON file."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Rules file not found at {filepath}")
        return []
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {filepath}")
        return []

def check_condition(fact_value, operator, rule_value):
    """
    Checks if a single fact condition is met.
    This is the core of the reasoning logic.
    """
    try:
        # Check for numeric comparisons
        if operator == "greater_than":
            return float(fact_value) > float(rule_value)
        if operator == "less_than":
            return float(fact_value) < float(rule_value)
        
        # Check for string equality
        if operator == "equals":
            return str(fact_value) == str(rule_value)
        
        # You can easily add more operators
        # if operator == "not_equals":
        #     return str(fact_value) != str(rule_value)
            
    except Exception as e:
        print(f"Warning: Could not check condition ({fact_value} {operator} {rule_value}). Error: {e}")
        return False
    return False

def run_inference_engine(facts, rules):
    """
    Runs the inference engine (forward chaining) to get recommendations.
    This is the XAI "glass box" part.
    """
    triggered_recommendations = []
    
    # Loop through every rule in the knowledge base
    for rule in rules:
        all_conditions_met = True
        
        # Check every 'if' condition for the rule
        for condition in rule['if']:
            fact_name = condition['fact']
            
            if fact_name not in facts:
                # If we don't have the fact, this rule can't fire
                all_conditions_met = False
                break
            
            fact_value = facts[fact_name]
            
            # If any condition is false, stop checking this rule
            if not check_condition(fact_value, condition['operator'], condition['value']):
                all_conditions_met = False
                break
        
        # If all conditions were true, this rule "fires"!
        if all_conditions_met:
            # We add the 'then' block AND the rule name for explainability
            recommendation = rule['then']
            recommendation['reason'] = rule['rule_name'] # This is the XAI
            triggered_recommendations.append(recommendation)
            
    return triggered_recommendations

# --- This is how we test our engine ---
if __name__ == "__main__":
    
    # 1. These are our "mock facts".
    # In your viva, you can change these values to demo the engine!
    mock_facts = {
        # --- Facts for old rules ---
        "current_par_percent": 16, # Triggers "Simple PAR Warning"
        "forecasted_collections_next_week": 85000, # Triggers "High Risk Branch"
        "forecasted_growth_next_month": 25, # Does NOT trigger "Slowing Customer Growth (Forecast)"
        "client_risk_score": 0.85,
        "loan_product_type": "New Business Loan", # Triggers "High Risk New Loan (ML Score)"
        
        # --- Facts for NEW rules (from your last request) ---
        "client_current_dpd": 28, # Triggers "Client Approaching Delinquency"
        "applicant_cibil_score": 550, # Triggers "High-Risk Applicant (CIBIL)"
        "branch_collection_rate_30d": 82, # Triggers "Branch Collection Rate Warning"
        "customer_growth_30d": 3 # Triggers "Stagnant Customer Growth (Actual)"
    }
    
    print(f"--- Running Advisor Engine ---")
    print(f"Facts loaded: {json.dumps(mock_facts, indent=2)}\n")
    
    # 2. Load the rules (from the updated rules.json)
    all_rules = load_rules("rules.json")
    
    if all_rules:
        # 3. Run the engine
        recommendations = run_inference_engine(mock_facts, all_rules)
        
        # 4. Print the results
        if recommendations:
            print("--- AI Advisor Recommendations ---")
            for rec in recommendations:
                print(f"  [!] Alert: {rec['alert']}")
                print(f"      Recommendation: {rec['recommendation']}")
                print(f"      Reason (XAI): {rec['reason']}\n")
        else:
            print("--- All systems normal. No recommendations. ---")