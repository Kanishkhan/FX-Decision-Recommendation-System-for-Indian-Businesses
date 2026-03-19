# FX Decision Recommendation System for Indian Businesses

## Course
23CSE452 – Business Analytics  
Capstone Project

## Project Overview
In today's globalized economy, Indian businesses (such as importers, exporters, IT service companies, and startups) face massive financial exposure to foreign exchange (FX) fluctuations. A sudden drop in the USD/INR or GBP/INR rate can wipe out a company's profit margins overnight. Knowing when to convert money or hedge is a critical, yet highly difficult mathematical challenge.

This project proposes a **Full-Stack FX Decision Recommendation System** that applies advanced business analytics, machine learning (time-series forecasting), and statistical risk engines to support data-driven foreign exchange decision-making. The system bridges the gap between raw exchange rate data and business-relevant insights by quantifying currency exposure, calculating real-time risk, and generating prescriptive recommendations via a modern web dashboard.

---

## Business Insights & BA Concepts Applied (Rubric Alignment)

### 1. Relevance of Topics and Justification
This project addresses a real-world, high-stakes financial problem. Instead of relying on human intuition, this system provides objective, mathematical answers. By building a fully automated prediction and risk identification engine, we justified the need to protect the business from unforeseen crashes. The module provides an automated "Black Swan Alert" and unified risk scoring, actively advising CEOs when it is too dangerous or highly profitable to convert their money.

### 2. Dataset Selection and BA Concepts Applied
We utilized a historical time-series dataset of major global currency pairs (USD, EUR, GBP, JPY vs INR) using Yahoo Finance and RBI data. Several core Business Analytics concepts were successfully engineered:
- **Descriptive & Predictive Analytics:** 30-day rolling standard deviations (`.std()`) and Facebook Prophet ML Models predict future movements and confidence intervals.
- **Anomaly Detection (Z-Score):** Implemented statistical limiters using Z-Scores `(Current - Mean) / StdDev` to statistically identify and flag rare outlier events.
- **Data Normalization:** Applied Min-Max scaling to compress massive monetary exposures and microscopic volatilities into a standardized 0-100 impact array.
- **Value-at-Risk (VaR):** Calculated the 5th percentile (`np.percentile`) of historical returns to statistically define the 95% Confidence VaR (worst-case scenario modeling).

### 3. Key Business Insights Generated
Through building this analytical engine, several critical business insights were realized:
- **Risk Standardization:** By normalizing vastly different metrics (market volatility vs. specific dollar exposure), we created highly intuitive **0-100 Speedometer Risk Gauges** that allow non-technical executives to assess complex mathematical dangers in seconds.
- **Emotional Independence (Z-Score Guardrails):** Automating Z-Score thresholds removes emotional trading. The system flawlessly and mathematically proves when standard pricing models are unreliable via automated warnings.
- **Concrete Financial Mapping:** Translating abstract percentages into concrete Rupee losses via VaR models forces rational, grounded financial decision-making, minimizing corporate losses during high-volatility events.
- **Quadrant Risk Mapping:** Visually plotting Volatility vs. USD Sensitivity allows finance managers to instantly categorize their corporate holdings into "High Danger" vs "Safe Haven" trading zones.

---

## 📈 Real-World Business Scenarios (Case Studies)

Our platform is engineered to handle various Indian business profiles differently using prescriptive engine logic:

### Case 1: The IT Exporter (Earning USD)
An Indian IT firm with a **$100,000 receivable** scheduled for next week.
- **The Engine Insight:** The Risk Engine detects low volatility, while the Forecast Engine predicts the USD/INR will rise from ₹83 to ₹84.
- **The Recommendation:** **"WAIT"**. The system advises the exporter to hold their dollars, potentially increasing their profit by ₹1 Lakh.

### Case 2: The Garment Importer (Paying USD)
A textile unit needs to pay a **$50,000 invoice** for raw materials immediately.
- **The Engine Insight:** The Z-Score detection triggers a **"Black Swan Alert"** (Z > 2.0), signaling a sudden rupee crash is imminent.
- **The Recommendation:** **"HEDGE NOW"**. The system advises the importer to buy their USD at today's rate immediately to avoid the bankruptcy-level costs of a spiked exchange rate tomorrow.

---

## Platform Methodology
Our methodology was implemented dynamically via a Python Flask backend serving a localized React dashboard, eliminating manual analysis.
1. **Data Ingestion & Stabilization (Srividya):** Fetches historical/live data and stabilizes the time-series using Augmented Dickey-Fuller (ADF) tests to enable accurate machine learning.
2. **Predictive Forecasting (Adwaitha):** Runs Facebook Prophet models trained on historic data. It projects 7-30 day rate forecasts alongside Upper/Lower statistical confidence bounds.
3. **Risk Scoring Engine (Kanishkhan):** Computes rolling variations, Z-Score anomaly triggers, and VaR percentiles. It normalizes exposure risk to output real-time "Black Swan Alerts" and 0-100 Danger classifications.
4. **Business Exposure Modeling (Aadhithya):** Calculates Profit-at-Risk by merging live rates with user-defined contract types (Import/Export) and deal sizes to produce prescriptive action triggers (Hedge vs Spot).
5. **Dashboard Integration (Adarsh):** Connects the JSON Python API securely to a dynamic React Front-End, providing live metrics, responsive quadrants, and real-time user notification systems.

---

## Tools & Technologies
- **Backend Analytics Engine:** Python, Flask API, Pandas, NumPy, Statsmodels.
- **Predictive Modelling:** Facebook Prophet (Time-Series ML), yfinance.
- **Frontend Dashboard:** React, Vite, Tailwind CSS, Recharts.
- **Version Control & Collaboration:** Git, GitHub.

---

## 🖥️ User Experience & Interaction Design

Our project prioritizes the "Human-in-the-loop" experience, ensuring complex BA models are useful for everyday business owners:
1. **The Discovery Phase:** Users start at the **Overview Dashboard**, seeing live market tickers and high-level health signals (Engine Heartbeat, Last Compute).
2. **The "What-If" Analysis:** In the **Forecasting** tab, users can toggle between 7D and 30D views to see the AI's predicted "Safe Ranges" and "Risk Ranges."
3. **The Risk Audit:** Users navigate to the **Risk Matrix** to see the **Z-Score Anomaly Alerts** and **Value-at-Risk** sentences. This is where the "Black Swan Alert" warns users of extreme unpredicted market shifts.
4. **Actionable Decisions:** The **FX Calculator** allows users to input their specific deal size, which instantly updates the Risk Gauges and generates a recommendation: **"HEDGE NOW"** or **"WAIT FOR BETTER RATE"**.

---

## 📊 Risk Visualization Intelligence (By Kanishkhan)

The Risk Engine isn't just a backend script; it drives the most critical visuals on the platform:
- **Interactive Risk Gauges:** Standardizes raw volatility and user exposure into a single 0-100 "caution dial."
- **Quadrants of Risk:** Plots **Volatility vs. USD Sensitivity** to visually separate "Safe Haven" currencies from "High Volatility" assets.
- **Automated Alert Banners:** Dynamically triggered based on the Z-Score threshold (`> 2.0`), these high-contrast red banners ensure no human error in missing a market crash.

---

## 🚀 Technical Setup & Quick Start

To run this full-stack business analytics application locally:

### 1. Backend (Python/Flask)
```bash
# Navigate to backend directory
cd backend
# Install dependencies
pip install -r ../requirements.txt
# Start the API Bridge
python api_bridge.py
```

### 2. Frontend (React/Vite)
```bash
# Navigate to frontend directory
cd frontend
# Install Node dependencies
npm install
# Start the development server
npm run dev
```
Open `http://localhost:5173` to view the live Decision Support System.

---

---

## Note
All financial values, business scenarios, and assumptions used in this project are for academic and demonstration purposes only and do not represent any specific real-world organization.
