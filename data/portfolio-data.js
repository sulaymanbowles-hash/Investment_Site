/**
 * Investment Portfolio Data Structure
 * Phase 1: Foundation - Static portfolio data for UI development
 * Future phases will integrate with real-time APIs
 */

export const portfolioData = {
  // Portfolio overview metadata
  metadata: {
    name: "Sulayman Bowles Growth Portfolio",
    inception: "2024-01-15",
    lastUpdated: "2025-07-19T10:30:00Z",
    totalValue: 125000.00,
    currency: "USD",
    benchmarks: ["QQQ", "SPY", "ARKK"]
  },

  // Current portfolio holdings (Phase 1: Static data)
  holdings: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      quantity: 50,
      avgCost: 180.50,
      currentPrice: 195.25,
      marketValue: 9762.50,
      weight: 7.81,
      dayChange: 2.15,
      dayChangePercent: 1.11,
      totalReturn: 816.25,
      totalReturnPercent: 8.17,
      lastUpdated: "2025-07-19T10:30:00Z"
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      sector: "Technology",
      quantity: 30,
      avgCost: 420.00,
      currentPrice: 445.75,
      marketValue: 13372.50,
      weight: 10.70,
      dayChange: 5.25,
      dayChangePercent: 1.19,
      totalReturn: 772.50,
      totalReturnPercent: 6.13,
      lastUpdated: "2025-07-19T10:30:00Z"
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      sector: "Technology",
      quantity: 25,
      avgCost: 165.00,
      currentPrice: 175.80,
      marketValue: 4395.00,
      weight: 3.52,
      dayChange: 1.95,
      dayChangePercent: 1.12,
      totalReturn: 270.00,
      totalReturnPercent: 6.55,
      lastUpdated: "2025-07-19T10:30:00Z"
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      sector: "Technology",
      quantity: 15,
      avgCost: 890.00,
      currentPrice: 1125.50,
      marketValue: 16882.50,
      weight: 13.51,
      dayChange: 15.75,
      dayChangePercent: 1.42,
      totalReturn: 3532.50,
      totalReturnPercent: 26.48,
      lastUpdated: "2025-07-19T10:30:00Z"
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      sector: "Consumer Discretionary",
      quantity: 20,
      avgCost: 245.00,
      currentPrice: 285.60,
      marketValue: 5712.00,
      weight: 4.57,
      dayChange: 8.20,
      dayChangePercent: 2.96,
      totalReturn: 812.00,
      totalReturnPercent: 16.57,
      lastUpdated: "2025-07-19T10:30:00Z"
    },
    {
      symbol: "META",
      name: "Meta Platforms, Inc.",
      sector: "Communication Services",
      quantity: 35,
      avgCost: 485.00,
      currentPrice: 512.30,
      marketValue: 17930.50,
      weight: 14.34,
      dayChange: 6.80,
      dayChangePercent: 1.35,
      totalReturn: 955.50,
      totalReturnPercent: 5.63,
      lastUpdated: "2025-07-19T10:30:00Z"
    }
  ],

  // Portfolio performance metrics
  performance: {
    dailyReturn: 1245.75,
    dailyReturnPercent: 1.01,
    weeklyReturn: 3420.80,
    weeklyReturnPercent: 2.82,
    monthlyReturn: 5678.90,
    monthlyReturnPercent: 4.76,
    ytdReturn: 18934.50,
    ytdReturnPercent: 17.85,
    totalReturn: 22157.25,
    totalReturnPercent: 21.53,
    sharpeRatio: 1.45,
    beta: 1.12,
    volatility: 18.5,
    maxDrawdown: -8.3
  },

  // Sector allocation
  sectorAllocation: [
    { sector: "Technology", value: 43530.00, weight: 34.82, target: 40.0 },
    { sector: "Communication Services", value: 17930.50, weight: 14.34, target: 15.0 },
    { sector: "Consumer Discretionary", value: 5712.00, weight: 4.57, target: 10.0 },
    { sector: "Healthcare", value: 12500.00, weight: 10.0, target: 15.0 },
    { sector: "Financial Services", value: 8750.00, weight: 7.0, target: 10.0 },
    { sector: "Cash", value: 36577.50, weight: 29.26, target: 10.0 }
  ],

  // Risk metrics
  riskMetrics: {
    portfolioBeta: 1.12,
    sharpeRatio: 1.45,
    sortinoRatio: 1.78,
    informationRatio: 0.85,
    treynorRatio: 0.142,
    maxDrawdown: -8.3,
    var95: -2.8,
    cvar95: -4.2,
    tracking_error: 3.2
  },

  // Investment thesis for each holding
  investmentThesis: [
    {
      symbol: "AAPL",
      thesis: "Dominant ecosystem with recurring revenue from services, strong brand loyalty, and expansion into new categories like AR/VR.",
      conviction: "High",
      timeHorizon: "Long-term",
      catalysts: ["Vision Pro adoption", "Services growth", "India market expansion"],
      risks: ["Regulatory pressure", "China dependency", "Innovation pace"]
    },
    {
      symbol: "NVDA",
      thesis: "Leading AI infrastructure provider with dominant position in data center GPUs and expanding into edge computing.",
      conviction: "Very High",
      timeHorizon: "Long-term",
      catalysts: ["AI model scaling", "Enterprise AI adoption", "Autonomous vehicles"],
      risks: ["Competition from hyperscalers", "Cyclical demand", "Geopolitical tensions"]
    },
    {
      symbol: "META",
      thesis: "Transition to metaverse computing platform while maintaining social media dominance and advertising efficiency.",
      conviction: "Medium",
      timeHorizon: "Medium-term",
      catalysts: ["VR/AR adoption", "AI advertising optimization", "Threads growth"],
      risks: ["Regulatory scrutiny", "Privacy concerns", "Metaverse ROI uncertainty"]
    }
  ]
};

// Benchmark data for comparison
export const benchmarkData = {
  QQQ: {
    name: "Invesco QQQ Trust",
    currentPrice: 485.60,
    dayChange: 4.85,
    dayChangePercent: 1.01,
    ytdReturn: 15.4
  },
  SPY: {
    name: "SPDR S&P 500 ETF",
    currentPrice: 560.25,
    dayChange: 3.20,
    dayChangePercent: 0.57,
    ytdReturn: 12.8
  },
  ARKK: {
    name: "ARK Innovation ETF",
    currentPrice: 45.30,
    dayChange: 0.85,
    dayChangePercent: 1.91,
    ytdReturn: 8.2
  }
};

// Market context data (Phase 1: Static)
export const marketContext = {
  indices: {
    SP500: { value: 5605.25, change: 28.15, changePercent: 0.50 },
    NASDAQ: { value: 18234.50, change: 125.80, changePercent: 0.69 },
    DOW: { value: 40589.25, change: 95.30, changePercent: 0.24 },
    VIX: { value: 12.85, change: -0.45, changePercent: -3.38 }
  },
  sectors: {
    technology: { performance: 1.25, leader: "NVDA" },
    healthcare: { performance: 0.45, leader: "UNH" },
    financial: { performance: 0.78, leader: "JPM" },
    energy: { performance: -0.32, leader: "XOM" }
  },
  economic: {
    fedRate: 5.25,
    inflation: 3.2,
    unemployment: 3.6,
    gdpGrowth: 2.4
  }
};

// News/events data (Phase 1: Static)
export const portfolioNews = [
  {
    id: 1,
    symbol: "NVDA",
    headline: "NVIDIA Reports Record Q2 Earnings Driven by AI Demand",
    summary: "NVIDIA exceeded expectations with $60.9B revenue, up 122% YoY, driven by data center growth.",
    sentiment: "positive",
    impact: "high",
    timestamp: "2025-07-19T09:15:00Z",
    source: "Financial Times"
  },
  {
    id: 2,
    symbol: "AAPL",
    headline: "Apple Vision Pro Sales Exceed Initial Projections",
    summary: "Early adoption of Apple's mixed reality headset shows strong enterprise demand.",
    sentiment: "positive",
    impact: "medium",
    timestamp: "2025-07-19T08:30:00Z",
    source: "Bloomberg"
  },
  {
    id: 3,
    symbol: "META",
    headline: "Meta's Reality Labs Division Shows Progress on Cost Reduction",
    summary: "Metaverse investments showing early signs of efficiency improvements.",
    sentiment: "neutral",
    impact: "medium",
    timestamp: "2025-07-19T07:45:00Z",
    source: "Reuters"
  }
];

export default portfolioData;
