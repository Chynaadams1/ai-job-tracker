import pandas as pd
import math

def analyze_job_applications(records: list) -> dict:
    if not records:
        return {"error": "No application data found"}

    df = pd.DataFrame(records)
    df['created_at'] = pd.to_datetime(df['created_at'])
    df = df.sort_values('created_at')

    # 1. Applications by week
    df['week'] = df['created_at'].dt.to_period('W').astype(str)
    apps_by_week = df.groupby('week').size().to_dict()

    # 2. Status breakdown
    status_counts = df['status'].value_counts().to_dict()

    # 3. Response rate
    responded = df[df['status'].isin([
        'interview', 'offer', 'rejected'
    ])]
    response_rate = round(len(responded) / len(df) * 100, 1)

    # 4. Top 5 companies applied to
    top_companies = df['company'].value_counts().head(5).to_dict()

    # 5. Average AI match score
    if 'match_score' in df.columns:
        scores = pd.to_numeric(df['match_score'], errors='coerce').dropna()
        avg_score = round(float(scores.mean()), 1) if len(scores) > 0 else None
    else:
        avg_score = None

    # 6. Trend
    weeks = list(apps_by_week.values())
    if len(weeks) >= 2:
        if weeks[-1] > weeks[-2]:
            trend = "increasing"
        elif weeks[-1] < weeks[-2]:
            trend = "decreasing"
        else:
            trend = "steady"
    else:
        trend = "not enough data"

    # 7. Build result and clean any nan values
    result = {
        "total_applications":   len(df),
        "response_rate_pct":    response_rate,
        "status_breakdown":     status_counts,
        "applications_by_week": apps_by_week,
        "top_companies":        top_companies,
        "avg_ai_match_score":   avg_score,
        "application_trend":    trend,
    }

    return {
        k: (None if isinstance(v, float) and math.isnan(v) else v)
        for k, v in result.items()
    }