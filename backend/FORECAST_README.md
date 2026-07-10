# Forecast Engine — Prophet-Based FX Forecasting

**Author:** Adwaitha (Forecasting Lead)  
**File:** `forecast_engine.py`

---

## What It Does

This module predicts future exchange rates (e.g., USD/INR, EUR/INR) for the next 7 days using **Facebook Prophet**, a time-series forecasting model.

It takes in historical exchange rate data, trains a Prophet model on it, and outputs:

- **Predicted rate** — the expected rate on the final forecast day
- **Upper bound** — the worst-case (95% confidence) scenario
- **Lower bound** — the best-case (95% confidence) scenario
- **Trend** — whether the rate is going UP or DOWN
- **Daily forecast table** — day-by-day predictions for charts

---

## How It Works (Step by Step)

### 1. Get the Data
The engine calls `get_final_data()` from `data_engine.py` (Srividya's module) to fetch cleaned, merged historical exchange rate data.

### 2. Prepare for Prophet
Prophet requires two specific columns:
- `ds` → the date
- `y` → the value to forecast (the exchange rate)

The function `_prepare_prophet_df()` renames our columns to match this format and drops any missing values.

### 3. Train the Model
A Prophet model is created with these settings:
- **Weekly seasonality** — captures patterns like weekday vs weekend effects
- **Yearly seasonality** — captures annual trends (e.g., budget season, fiscal year effects)
- **95% confidence interval** — gives upper and lower bounds for each prediction
- **Changepoint prior scale = 0.05** — controls how sensitive the model is to trend changes (lower = smoother, more stable forecasts)

The model trains on the **last 365 days** of data (configurable).

### 4. Predict Future Rates
Prophet generates a future dataframe for the next `N` days (default: 7) and runs `.predict()` to get forecasted values.

### 5. Return Results
The output is a clean dictionary with everything the frontend and other modules need.

---

## Supported Currencies

| Currency | Pair       |
|----------|------------|
| USD      | USD / INR  |
| GBP      | GBP / INR  |
| EUR      | EUR / INR  |
| JPY      | JPY / INR  |

---

## Key Functions

### `run_forecast(currency, days, df)`
Forecasts a single currency pair.

**Parameters:**
| Param      | Default | Description                             |
|------------|--------|-----------------------------------------|
| `currency` | `"USD"` | Which currency to forecast              |
| `days`     | `7`     | How many days ahead to predict          |
| `df`       | `None`  | Pre-loaded data (fetches automatically if not passed) |

**Returns:** A dictionary like this:
```json
{
  "status": "success",
  "currency": "USD",
  "current_rate": 83.45,
  "predicted_rate": 83.72,
  "forecast_upper": 84.10,
  "forecast_lower": 83.35,
  "trend": "UP",
  "change_percent": 0.32,
  "forecast_table": [
    { "ds": "2026-03-20", "yhat": 83.50, "yhat_lower": 83.20, "yhat_upper": 83.80 },
    ...
  ],
  "message": "The USD/INR rate is currently 83.45. Over the next 7 days..."
}
```

### `run_all_forecasts(days)`
Runs `run_forecast()` for **all 4 currencies** in one call. Fetches data once and reuses it for efficiency.

---

## How Other Modules Use It

- **`api_bridge.py`** — Calls `run_forecast()` to serve forecast data to the React frontend via REST API
- **`fx_engine.py`** — Uses forecast results to generate hedging recommendations
- **Frontend** — Displays the forecast charts, trend indicators, and confidence bands in the dashboard

---

## Constants

| Constant              | Value | Meaning                                      |
|-----------------------|-------|----------------------------------------------|
| `DEFAULT_FORECAST_DAYS` | 7     | Default prediction horizon                   |
| `MIN_TRAINING_ROWS`    | 60    | Minimum data points needed for a forecast    |
| `TRAINING_WINDOW`      | 365   | Uses last 1 year of data for training        |
| `SUPPORTED_CURRENCIES` | 4     | USD, GBP, EUR, JPY                           |

---

## Quick Test

Run the module standalone to test:
```bash
cd backend
python forecast_engine.py
```

This will forecast USD/INR for 7 days and print the results to the console.

---

## Dependencies

- `prophet` — Facebook's time-series forecasting library
- `pandas` — Data manipulation
- `numpy` — Numerical operations
- `data_engine.py` — Provides the cleaned historical FX data
