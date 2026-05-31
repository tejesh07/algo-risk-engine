import React, { useState } from 'react';
import { Play, TrendingUp, BarChart2, Cpu, AlertTriangle } from 'lucide-react';

export default function App() {
  // State management for user inputs and loading states
  const [ticker, setTicker] = useState('AAPL');
  const [prompt, setPrompt] = useState('Buy when the stock drops heavily using a 20 day moving average strategy');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Function to call our FastAPI backend pipeline
  const handleRunBacktest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    // Resolve Backend API Base URL dynamically (Vercel Prod Env vs. Local Sandbox)
    const API_URL = import.meta.env.VITE_API_URL || "https://algo-risk-engine.onrender.com";

    try {
      const response = await fetch(`${API_URL}/api/backtest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: ticker,
          prompt: prompt,
          days_back: 365,
        }),
      });

      if (!response.ok) {
        throw new Error('Backend server responded with an error status.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(`Could not connect to the backend server. Target Pipeline Address: ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.75rem', color: '#38bdf8' }}>
          <Cpu /> Multi-Agent Algo Trading & Risk Engine
        </h1>
        <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Senior Portfolio Management Architecture Pipeline</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Side: Control Panel Form */}
        <section style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#f1f5f9' }}>Strategy Input</h2>
          <form onSubmit={handleRunBacktest}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Stock Ticker</label>
              <input 
                type="text" 
                value={ticker} 
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                required 
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Natural Language Strategy Idea (AI Mode)</label>
              <textarea 
                rows="4"
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box', resize: 'vertical' }}
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: loading ? '#64748b' : '#0284c7', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Play size={18} /> {loading ? 'Running AI Engine...' : 'Execute Strategy'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#7f1d1d', border: '1px solid #f87171', borderRadius: '4px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> 
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Right Side: Execution Dashboard Output */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!results && !loading && (
            <div style={{ backgroundColor: '#1e293b', border: '2px dashed #334155', borderRadius: '8px', padding: '4rem', textAlign: 'center', color: '#64748b' }}>
              <BarChart2 size={48} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
              Configure strategy parameters and click Execute to view real-time architectural evaluations.
            </div>
          )}

          {loading && (
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '4rem', textAlign: 'center', color: '#38bdf8' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Processing Pipeline Execution...</div>
              <p style={{ color: '#94a3b8', margin: 0 }}>Consulting AI Agents and executing core historical math models simultaneously.</p>
            </div>
          )}

          {results && (
            <>
              {/* Financial Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Strategy Return</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: results.financial_metrics.strategy_return_pct >= 0 ? '#4ade80' : '#f87171' }}>
                    {results.financial_metrics.strategy_return_pct}%
                  </div>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Benchmark Return (Buy & Hold)</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: results.financial_metrics.benchmark_return_pct >= 0 ? '#4ade80' : '#f87171' }}>
                    {results.financial_metrics.benchmark_return_pct}%
                  </div>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Executed Trades Count</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#e2e8f0' }}>
                    {results.financial_metrics.total_trades_executed} trades
                  </div>
                </div>
              </div>

              {/* AI Analysis Output */}
              <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#38bdf8' }}>
                  <TrendingUp size={18} /> Deep Core AI Agent Interpretation
                </h3>
                <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '6px', border: '1px solid #334155', color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {results.ai_interpretation}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}