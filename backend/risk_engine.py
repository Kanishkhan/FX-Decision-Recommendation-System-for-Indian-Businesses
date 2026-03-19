"""
risk_engine.py — Quant Module (The "Safety")
=============================================
Author : Kanishkhan (Risk Lead)
Project: FX Decision Recommendation System for Indian Businesses

This module quantifies market danger using:
1. 30-day Rolling Volatility
2. Z-Score Anomaly Detection
3. Value-at-Risk (VaR)
"""

import pandas as pd
import numpy as np

def calculate_risk_metrics(df: pd.DataFrame, currency: str = "USD", exposure_usd: float = 100000) -> dict:
    """
    Calculates technical risk metrics for a specific currency pair.
    
    Parameters:
    -----------
    df : pd.DataFrame
        DataFrame containing historical and live exchange rates (from data_engine).
    currency : str
        The currency code (e.g., 'USD', 'EUR', 'GBP').
        
    Returns:
    --------
    dict
        A dictionary containing Volatility, Z-Score, Anomaly flag, and VaR.
    """
    # 1. Ensure we have the required series
    if currency not in df.columns:
        raise ValueError(f"Currency {currency} not found in the dataset.")
    
    series = df[currency].dropna()
    returns = df[f"{currency}_Return"].dropna()
    
    # --- Step 1: 30-day Rolling Volatility (Standard Deviation of Rates) ---
    rolling_vol = series.rolling(window=30).std()
    current_vol = rolling_vol.iloc[-1]
    
    # --- Step 2: Z-Score Anomaly Detection ---
    rolling_mean = series.rolling(window=30).mean()
    current_rate = series.iloc[-1]
    last_mean = rolling_mean.iloc[-1]
    last_std = rolling_vol.iloc[-1]
    
    if last_std == 0 or np.isnan(last_std):
        z_score = 0
    else:
        z_score = (current_rate - last_mean) / last_std
    
    is_anomaly = abs(z_score) > 2.0
    
    # --- Step 3: Value-at-Risk (VaR) ---
    var_return_threshold = np.percentile(returns, 5)
    inr_loss_amount = abs(var_return_threshold * current_rate)
    
    # --- Step 4: Composite Risk Score & Level ---
    mean_vol = rolling_vol.mean()
    vol_score = min(100, (current_vol / mean_vol) * 40) if (mean_vol and mean_vol > 0) else 0
    
    exp_score = min(100, ((exposure_usd - 10000) / (500000 - 10000)) * 100)
    exp_score = max(0, exp_score)
    
    final_score = (0.6 * vol_score) + (0.4 * exp_score)
    level = "Low" if final_score < 40 else "Medium" if final_score <= 70 else "High"

    var_message = f"There is a 5% chance you could lose more than {inr_loss_amount:.2f} INR by tomorrow."
    
    return {
        "currency": currency,
        "current_rate": round(current_rate, 4),
        "30d_volatility": round(current_vol, 4),
        "z_score": round(z_score, 2),
        "is_anomaly": is_anomaly,
        "var_95_percentile": round(var_return_threshold, 6),
        "inr_loss_amount": round(inr_loss_amount, 2),
        "var_message": var_message,
        "score": round(final_score, 2),
        "level": level
    }

def get_risk_report(df: pd.DataFrame):
    """
    Generates a risk report for all major currencies.
    """
    currencies = ["USD", "GBP", "EUR", "JPY"]
    report = {}
    for cur in currencies:
        try:
            report[cur] = calculate_risk_metrics(df, cur)
        except Exception as e:
            print(f"[RISK ENGINE] Error calculating metrics for {cur}: {e}")
    return report

if __name__ == "__main__":
    # Quick Test
    from data_engine import get_final_data
    df, _ = get_final_data()
    usd_risk = calculate_risk_metrics(df, "USD")
    print("\n--- USD Risk Metrics ---")
    for k, v in usd_risk.items():
        print(f"{k}: {v}")

"""
========================================================================
BUSINESS ANALYTICS IMPLEMENTATION NOTES & KEY CONCEPTS
Author: Kanishkhan (Risk Scoring Engine)
========================================================================
1. Risk Gauge (Normalization & Weighting Strategy):
   Formula: Risk = (0.6 * Volatility_Score) + (0.4 * Exposure_Score)
   - Reason: Standard deviations are tiny logic intervals, whereas monetary
     exposures are massive strings (e.g. $100,000). Before blending them, 
     min-max scaling compresses them both into a clean 0-100 logic scale,
     preventing the exposure cost from artificially dominating the risk score.

2. Z-Score Anomaly Detection ("Black Swan" Trigger):
   Formula: Z = (Today's Price - 30_Day_Average) / 30_Day_Volatility
   - Rule: Trigger automatic alert if |Z| > 2.0
   - Reason: A Z-score greater than 2.0 proves statistically that the currency
     has deviated drastically from typical pricing behavior. This automates
     monitoring and removes human emotion, pushing a critical alert when standard 
     pricing models become unreliable.

3. Value-at-Risk (VaR) 95% Confidence Methodology:
   Formula: var_return_threshold = np.percentile(returns, 5)
   - Reason: By isolating the 5th percentile of historical daily drops, the 
     engine discards the single "worst freak accident day" but still captures 
     a mathematically sound "worst-case scenario." Multiplying this crash 
     percentage against live pricing gives CEOs concrete Rupee exposure targets.
========================================================================
"""
