
import yfinance as yf
import pandas as pd

def run_simple_backtest(ticker: str, days_back: int = 365):
    """
    Fetches real stock data and runs a basic moving average trading strategy.
    Buy when 20-day average crosses above 50-day average. 
    Sell when it crosses below.
    """
    try:
        # 1. Fetch real historical data from Yahoo Finance
        # '1d' means we want one data point per day
        period = f"{days_back}d"
        stock_data = yf.download(ticker, period=period, interval="1d")
        
        if stock_data.empty:
            return {"error": f"No data found for ticker symbol: {ticker}"}
        
        # 2. Flatten the data columns (yfinance sometimes returns multi-index columns)
        df = stock_data.copy()
        
        # 3. Calculate technical indicators using Pandas
        # Moving Averages smooth out price data to find trends
        df['Fast_MA'] = df['Close'].rolling(window=20).mean() # 20-day average
        df['Slow_MA'] = df['Close'].rolling(window=50).mean() # 50-day average
        
        # Drop rows that don't have enough data to calculate the averages yet
        df = df.dropna(subset=['Fast_MA', 'Slow_MA'])
        
        if len(df) < 2:
            return {"error": "Not enough historical data to run the backtest math."}

        # 4. Simulated Trading Logic
        # Position: 1 means we bought the stock, 0 means we are sitting on cash
        position = 0 
        buy_price = 0
        total_return_pct = 0.0
        trades_count = 0
        
        # Loop through every trading day to simulate the past
        for i in range(len(df)):
            current_close = float(df['Close'].iloc[i])
            fast_ma = float(df['Fast_MA'].iloc[i])
            slow_ma = float(df['Slow_MA'].iloc[i])
            
            # BUY SIGNAL: Fast average crosses ABOVE Slow average, and we don't own it yet
            if fast_ma > slow_ma and position == 0:
                position = 1
                buy_price = current_close
                trades_count += 1
                
            # SELL SIGNAL: Fast average crosses BELOW Slow average, and we currently own it
            elif fast_ma < slow_ma and position == 1:
                position = 0
                # Calculate the profit or loss of this specific trade
                trade_return = (current_close - buy_price) / buy_price
                total_return_pct += trade_return
                trades_count += 1
        
        # If we are still holding the stock on the final day, simulate selling it out
        if position == 1:
            final_close = float(df['Close'].iloc[-1])
            trade_return = (final_close - buy_price) / buy_price
            total_return_pct += trade_return

        # Convert raw decimal return into a clean percentage (e.g., 0.15 -> 15.0%)
        final_return_formatted = round(total_return_pct * 100, 2)
        
        # 5. Calculate buy-and-hold return for comparison (what if we just bought and did nothing?)
        initial_price = float(df['Close'].iloc[0])
        ending_price = float(df['Close'].iloc[-1])
        benchmark_return = round(((ending_price - initial_price) / initial_price) * 100, 2)

        return {
            "status": "success",
            "ticker": ticker.upper(),
            "strategy_return_pct": final_return_formatted,
            "benchmark_return_pct": benchmark_return,
            "total_trades_executed": trades_count
        }

    except Exception as e:
        return {"error": f"An infrastructure failure occurred: {str(e)}"}