import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_KEY") or os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def analyze_strategy_with_ai(user_prompt: str):
    """
    Takes a natural language prompt from the user and attempts to use OpenAI.
    If the account hits a 429 quota error or fails, it automatically triggers
    a localized fallback interpreter to keep the application running.
    """
    # Fallback #1: No key provided
    if not client or "your_actual_api_key_here" in api_key:
        return execute_local_fallback_ai(user_prompt)

    try:
        system_instructions = (
            "You are an expert algorithmic trading quantitative developer. Your job is to analyze "
            "a user's natural language trading strategy and break down its core elements. "
            "Provide a concise summary explaining what indicators the user wants to track, "
            "and evaluate the conceptual risk of their strategy."
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": f"Analyze this trading idea: {user_prompt}"}
            ],
            temperature=0.2
        )

        return {
            "analysis_status": "success",
            "interpreted_logic": response.choices[0].message.content,
            "recommended_days": 365
        }

    except Exception as e:
        # Fallback #2: Key exists, but API threw a 429 Quota or network error
        print(f"⚠️ OpenAI API Exception caught ({str(e)}). Engaging local fallback engine.")
        return execute_local_fallback_ai(user_prompt)


def execute_local_fallback_ai(user_prompt: str):
    """
    A local semantic interpreter that parses the prompt using basic string analysis.
    This ensures the client dashboard remains active and professional even during API outages.
    """
    # Simple rule-based logic to mimic AI insight
    risk_assessment = "MODERATE RISK SYSTEM"
    if "drop" in user_prompt.lower() or "panic" in user_prompt.lower():
        risk_assessment = "HIGH RISK: Mean-Reversion strategy attempting to catch a falling knife. Requires tight stop-loss thresholds."
    elif "moving average" in user_prompt.lower() or "ma" in user_prompt.lower():
        risk_assessment = "LOW-MODERATE RISK: Trend-Following architecture. Prone to capital erosion inside sideways/choppy market conditions."

    mocked_text = (
        f"🤖 [LOCAL SYSTEM FALLBACK AI AGENT]\n\n"
        f"STRATEGY PARSE SUMMARY:\n"
        f"The system detected the following operational goal: '{user_prompt}'\n\n"
        f"ARCHITECTURAL RISK MATRIX EVALUATION:\n"
        f"{risk_assessment}\n\n"
        f"RECOMMENDED NEXT TASK:\n"
        f"Integrate an Average True Range (ATR) indicator array to protect asset drawdowns during execution."
    )

    return {
        "analysis_status": "fallback_activated",
        "interpreted_logic": mocked_text,
        "recommended_days": 365
    }