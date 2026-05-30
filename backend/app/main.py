from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.engine import run_simple_backtest
# Import our new AI agent function!
from app.agents import analyze_strategy_with_ai

app = FastAPI(title="Multi-Agent Algo Trading & Risk Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CompletePipelineRequest(BaseModel):
    prompt: str
    ticker: str
    days_back: int = 365

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "Risk Engine AI Pipeline is online"}

@app.post("/api/backtest")
def execute_full_pipeline(payload: CompletePipelineRequest):
    """
    1. Sends the user's plain English idea to the AI Agent for analysis.
    2. Runs the stock ticket through our deterministic historical math engine.
    3. Combines both results into a clean corporate response dataset.
    """
    # Step 1: AI Analysis
    ai_result = analyze_strategy_with_ai(user_prompt=payload.prompt)
    
    # Step 2: Math Calculations
    math_result = run_simple_backtest(ticker=payload.ticker, days_back=payload.days_back)
    
    # Step 3: Combine everything to return to our dashboard
    return {
        "pipeline_status": "completed",
        "ticker": payload.ticker.upper(),
        "ai_interpretation": ai_result["interpreted_logic"],
        "financial_metrics": {
            "strategy_return_pct": math_result.get("strategy_return_pct", 0.0),
            "benchmark_return_pct": math_result.get("benchmark_return_pct", 0.0),
            "total_trades_executed": math_result.get("total_trades_executed", 0)
        }
    }