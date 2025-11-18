# FinSight AI: Saved Model Documentation

This document provides instructions for loading and using the pre-trained forecasting models (`.pkl` files) for the FinSight AI project.

## ⚠️ Important: How to Use These Files

These models were saved using `pickle`. To load them, you must have the same essential libraries installed in your environment, particularly:

  * `pandas`
  * `prophet`
  * `pickle`

Each model is a "black box" and **must** be given a future dataframe with the exact parameters it was trained on (frequency, floor, and cap).

-----

## 1\. Collections Forecast Model

  * **File:** `collections_forecast_model.pkl`
  * **What it forecasts:** The **total weekly principal collected** for a specific branch.
  * **Model Type:** Prophet, `growth='logistic'`
  * **Input Frequency:** Weekly (`freq='W'`)

### How to Use

```python
import pickle
import pandas as pd
from prophet import Prophet

# Load the model
with open('collections_forecast_model.pkl', 'rb') as f:
    model = pickle.load(f)

# 1. Create a future dataframe with WEEKLY frequency
future = model.make_future_dataframe(periods=12, freq='W') # 12 weeks

# 2. MUST provide the same floor and cap as in training
future['floor'] = 0
future['cap'] = 130000.0  # (Example: 1.2 * 108333) -> Use your actual cap value from training

# 3. Make the prediction
forecast = model.predict(future)

# Show results
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())
```

-----

## 2\. Loan Disbursement Model

  * **File:** `disbursement_forecast_model.pkl`
  * **What it forecasts:** The **total weekly loan disbursement** for a specific branch.
  * **Model Type:** Prophet, `growth='logistic'`
  * **Input Frequency:** Weekly (`freq='W'`)

### How to Use

```python
import pickle
import pandas as pd
from prophet import Prophet

# Load the model
with open('disbursement_forecast_model.pkl', 'rb') as f:
    model = pickle.load(f)

# 1. Create a future dataframe with WEEKLY frequency
future = model.make_future_dataframe(periods=12, freq='W') # 12 weeks

# 2. MUST provide the same floor and cap as in training
future['floor'] = 0
future['cap'] = 1305000.0 # (Example: 1.2 * 1087500) -> Use your actual cap value from training

# 3. Make the prediction
forecast = model.predict(future)

# Show results
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())
```

-----

## 3\. Customer Growth Model

  * **File:** `growth_forecast_model.pkl`
  * **What it forecasts:** The **total cumulative clients** for a specific branch.
  * **Model Type:** Prophet, `growth='logistic'`
  * **Input Frequency:** Daily (`freq='D'`)

### How to Use

```python
import pickle
import pandas as pd
from prophet import Prophet

# Load the model
with open('growth_forecast_model.pkl', 'rb') as f:
    model = pickle.load(f)

# 1. Create a future dataframe with DAILY frequency
future = model.make_future_dataframe(periods=90, freq='D') # 90 days

# 2. MUST provide the same floor and cap as in training
future['floor'] = 1.0  # (Example: 1.0) -> Use your actual min value from training
future['cap'] = 250.5  # (Example: 1.5 * 167.0) -> Use your actual cap value from training

# 3. Make the prediction
forecast = model.predict(future)

# Show results
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())
