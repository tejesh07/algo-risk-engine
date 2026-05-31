// Function to call our FastAPI backend pipeline
  const handleRunBacktest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    // Resolve Backend API Base URL dynamically (Vercel Prod Env vs. Local Sandbox)
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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