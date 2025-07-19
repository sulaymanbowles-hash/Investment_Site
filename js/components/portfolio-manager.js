/**
 * Portfolio Manager - Core Component
 * Phase 1: Foundation with static data
 * Future phases will integrate real-time APIs
 */

import { portfolioData, benchmarkData, marketContext, portfolioNews } from '../../data/portfolio-data.js';

class PortfolioManager {
  constructor() {
    this.data = portfolioData;
    this.benchmarks = benchmarkData;
    this.market = marketContext;
    this.news = portfolioNews;
    this.updateInterval = null;
    this.isRealTimeEnabled = false; // Phase 1: Static data only
    
    // Performance calculation cache
    this.calculations = {
      totalValue: 0,
      totalReturn: 0,
      totalReturnPercent: 0,
      dayChange: 0,
      dayChangePercent: 0,
      sectorWeights: new Map(),
      riskMetrics: {}
    };
    
    this.init();
  }

  /**
   * Initialize portfolio manager
   */
  init() {
    console.log('[Portfolio Manager] Initializing with static data (Phase 1)');
    this.calculatePortfolioMetrics();
    this.setupEventListeners();
    this.render();
  }

  /**
   * Calculate portfolio-level metrics from holdings
   */
  calculatePortfolioMetrics() {
    const holdings = this.data.holdings;
    
    // Calculate total values
    this.calculations.totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    this.calculations.totalReturn = holdings.reduce((sum, holding) => sum + holding.totalReturn, 0);
    this.calculations.dayChange = holdings.reduce((sum, holding) => 
      sum + (holding.quantity * holding.dayChange), 0);
    
    // Calculate percentages
    this.calculations.totalReturnPercent = (this.calculations.totalReturn / 
      (this.calculations.totalValue - this.calculations.totalReturn)) * 100;
    this.calculations.dayChangePercent = (this.calculations.dayChange / 
      (this.calculations.totalValue - this.calculations.dayChange)) * 100;
    
    // Calculate sector weights
    this.calculations.sectorWeights.clear();
    holdings.forEach(holding => {
      const sector = holding.sector;
      const currentWeight = this.calculations.sectorWeights.get(sector) || 0;
      this.calculations.sectorWeights.set(sector, currentWeight + holding.weight);
    });
    
    // Update metadata
    this.data.metadata.totalValue = this.calculations.totalValue;
    this.data.metadata.lastUpdated = new Date().toISOString();
    
    console.log('[Portfolio Manager] Metrics calculated:', this.calculations);
  }

  /**
   * Get portfolio summary for dashboard display
   */
  getPortfolioSummary() {
    return {
      totalValue: this.calculations.totalValue,
      dayChange: this.calculations.dayChange,
      dayChangePercent: this.calculations.dayChangePercent,
      totalReturn: this.calculations.totalReturn,
      totalReturnPercent: this.calculations.totalReturnPercent,
      holdings: this.data.holdings.length,
      lastUpdated: this.data.metadata.lastUpdated
    };
  }

  /**
   * Get top performers (gains and losses)
   */
  getTopPerformers() {
    const sorted = [...this.data.holdings].sort((a, b) => b.dayChangePercent - a.dayChangePercent);
    return {
      gainers: sorted.slice(0, 3),
      losers: sorted.slice(-3).reverse()
    };
  }

  /**
   * Get sector allocation data for charts
   */
  getSectorAllocation() {
    return this.data.sectorAllocation.map(sector => ({
      ...sector,
      difference: sector.weight - sector.target
    }));
  }

  /**
   * Get performance vs benchmarks
   */
  getBenchmarkComparison() {
    const portfolioReturn = this.data.performance.ytdReturn;
    
    return Object.entries(this.benchmarks).map(([symbol, data]) => ({
      symbol,
      name: data.name,
      return: data.ytdReturn,
      difference: portfolioReturn - data.ytdReturn,
      outperforming: portfolioReturn > data.ytdReturn
    }));
  }

  /**
   * Get recent news relevant to portfolio
   */
  getPortfolioNews(limit = 10) {
    return this.news
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get risk metrics summary
   */
  getRiskMetrics() {
    return {
      ...this.data.riskMetrics,
      riskRating: this.calculateRiskRating()
    };
  }

  /**
   * Calculate overall portfolio risk rating
   */
  calculateRiskRating() {
    const beta = this.data.riskMetrics.portfolioBeta;
    const volatility = this.data.riskMetrics.maxDrawdown;
    
    if (beta < 0.8 && volatility > -5) return 'Conservative';
    if (beta < 1.2 && volatility > -10) return 'Moderate';
    if (beta < 1.5 && volatility > -15) return 'Aggressive';
    return 'Very Aggressive';
  }

  /**
   * Get holdings for display with enhanced data
   */
  getHoldings() {
    return this.data.holdings.map(holding => ({
      ...holding,
      weightClass: this.getWeightClass(holding.weight),
      returnClass: this.getReturnClass(holding.totalReturnPercent),
      dayChangeClass: this.getChangeClass(holding.dayChangePercent)
    }));
  }

  /**
   * Get CSS class for position weight
   */
  getWeightClass(weight) {
    if (weight > 15) return 'large-position';
    if (weight > 10) return 'medium-position';
    if (weight > 5) return 'small-position';
    return 'micro-position';
  }

  /**
   * Get CSS class for returns
   */
  getReturnClass(returnPercent) {
    if (returnPercent > 20) return 'strong-gain';
    if (returnPercent > 10) return 'moderate-gain';
    if (returnPercent > 0) return 'small-gain';
    if (returnPercent > -10) return 'small-loss';
    return 'large-loss';
  }

  /**
   * Get CSS class for daily changes
   */
  getChangeClass(changePercent) {
    if (changePercent > 0) return 'positive';
    if (changePercent < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Setup event listeners for interactivity
   */
  setupEventListeners() {
    // Portfolio card hover effects
    document.addEventListener('DOMContentLoaded', () => {
      this.attachCardEventListeners();
      this.attachChartEventListeners();
    });
  }

  /**
   * Attach event listeners to portfolio cards
   */
  attachCardEventListeners() {
    const cards = document.querySelectorAll('.portfolio-card.investment-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.handleCardHover(e.target);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.handleCardLeave(e.target);
      });
      
      card.addEventListener('click', (e) => {
        this.handleCardClick(e.target);
      });
    });
  }

  /**
   * Attach event listeners to chart controls
   */
  attachChartEventListeners() {
    const chartControls = document.querySelectorAll('.chart-control-btn');
    chartControls.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleChartControl(e.target);
      });
    });
  }

  /**
   * Handle portfolio card hover
   */
  handleCardHover(card) {
    const symbol = card.dataset.symbol;
    if (symbol) {
      // Add visual emphasis
      card.style.zIndex = '10';
      card.style.transform = 'translateY(-12px) scale(1.03)';
      
      // Trigger related news highlight
      this.highlightRelatedNews(symbol);
    }
  }

  /**
   * Handle portfolio card leave
   */
  handleCardLeave(card) {
    card.style.zIndex = '1';
    card.style.transform = '';
    this.clearNewsHighlights();
  }

  /**
   * Handle portfolio card click
   */
  handleCardClick(card) {
    const symbol = card.dataset.symbol;
    if (symbol) {
      this.showHoldingDetails(symbol);
    }
  }

  /**
   * Handle chart control interactions
   */
  handleChartControl(btn) {
    const timeframe = btn.dataset.timeframe;
    const chartContainer = btn.closest('.chart-container');
    
    // Update active state
    chartContainer.querySelectorAll('.chart-control-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update chart data (Phase 1: Visual feedback only)
    this.updateChartTimeframe(chartContainer, timeframe);
  }

  /**
   * Highlight news related to a specific holding
   */
  highlightRelatedNews(symbol) {
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
      const newsSymbol = item.querySelector('.news-symbol');
      if (newsSymbol && newsSymbol.textContent === symbol) {
        item.style.background = 'rgba(52, 152, 219, 0.1)';
        item.style.borderColor = 'rgba(52, 152, 219, 0.3)';
      }
    });
  }

  /**
   * Clear news highlights
   */
  clearNewsHighlights() {
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
      item.style.background = '';
      item.style.borderColor = '';
    });
  }

  /**
   * Show detailed information for a specific holding
   */
  showHoldingDetails(symbol) {
    const holding = this.data.holdings.find(h => h.symbol === symbol);
    const thesis = this.data.investmentThesis.find(t => t.symbol === symbol);
    
    if (holding) {
      console.log('[Portfolio Manager] Showing details for:', symbol, holding, thesis);
      // Phase 1: Console output, Phase 2: Modal implementation
      this.displayHoldingModal(holding, thesis);
    }
  }

  /**
   * Display holding details modal (Phase 1: placeholder)
   */
  displayHoldingModal(holding, thesis) {
    // Phase 1: Simple alert, Phase 2: Rich modal
    const details = `
${holding.name} (${holding.symbol})
Price: $${holding.currentPrice.toFixed(2)}
Quantity: ${holding.quantity}
Total Return: ${holding.totalReturnPercent.toFixed(2)}%
Day Change: ${holding.dayChangePercent.toFixed(2)}%

Investment Thesis: ${thesis ? thesis.thesis : 'Not available'}
    `;
    
    alert(details);
  }

  /**
   * Update chart timeframe (Phase 1: visual feedback only)
   */
  updateChartTimeframe(container, timeframe) {
    const chartTitle = container.querySelector('.chart-subtitle');
    if (chartTitle) {
      chartTitle.textContent = `${timeframe.toUpperCase()} Performance`;
    }
    
    console.log('[Portfolio Manager] Chart timeframe updated to:', timeframe);
  }

  /**
   * Render portfolio dashboard
   */
  render() {
    this.renderPortfolioSummary();
    this.renderHoldings();
    this.renderSectorAllocation();
    this.renderNews();
    this.renderMarketTicker();
  }

  /**
   * Render portfolio summary metrics
   */
  renderPortfolioSummary() {
    const summary = this.getPortfolioSummary();
    const summaryElement = document.getElementById('portfolio-summary');
    
    if (summaryElement) {
      summaryElement.innerHTML = `
        <div class="performance-metric-card">
          <div class="performance-value ${this.getChangeClass(summary.dayChangePercent)}">
            $${summary.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div class="performance-label">Total Portfolio Value</div>
        </div>
        <div class="performance-metric-card">
          <div class="performance-value ${this.getChangeClass(summary.dayChangePercent)}">
            ${summary.dayChangePercent > 0 ? '+' : ''}${summary.dayChangePercent.toFixed(2)}%
          </div>
          <div class="performance-label">Today's Change</div>
        </div>
        <div class="performance-metric-card">
          <div class="performance-value ${this.getReturnClass(summary.totalReturnPercent)}">
            ${summary.totalReturnPercent > 0 ? '+' : ''}${summary.totalReturnPercent.toFixed(2)}%
          </div>
          <div class="performance-label">Total Return</div>
        </div>
      `;
    }
  }

  /**
   * Render holdings grid
   */
  renderHoldings() {
    const holdings = this.getHoldings();
    const holdingsElement = document.getElementById('holdings-grid');
    
    if (holdingsElement) {
      holdingsElement.innerHTML = holdings.map(holding => `
        <div class="portfolio-card investment-card" data-symbol="${holding.symbol}">
          <div class="portfolio-card__wrap">
            <div class="portfolio-card__header">
              <h3 class="portfolio-card__title">${holding.symbol}</h3>
              <div class="metric-value ${holding.dayChangeClass}">
                ${holding.dayChangePercent > 0 ? '+' : ''}${holding.dayChangePercent.toFixed(2)}%
              </div>
            </div>
            <div class="portfolio-card__content">
              <div class="chart-mini" data-symbol="${holding.symbol}"></div>
              <div class="investment-metrics">
                <div class="metric">
                  <span class="metric-label">Price</span>
                  <span class="metric-value">$${holding.currentPrice.toFixed(2)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Shares</span>
                  <span class="metric-value">${holding.quantity}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Value</span>
                  <span class="metric-value">$${holding.marketValue.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Return</span>
                  <span class="metric-value ${holding.returnClass}">
                    ${holding.totalReturnPercent > 0 ? '+' : ''}${holding.totalReturnPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
      
      // Reattach event listeners after rendering
      this.attachCardEventListeners();
    }
  }

  /**
   * Render sector allocation
   */
  renderSectorAllocation() {
    const sectors = this.getSectorAllocation();
    const sectorElement = document.getElementById('sector-breakdown');
    
    if (sectorElement) {
      sectorElement.innerHTML = sectors.map(sector => `
        <div class="sector-item">
          <div class="sector-info">
            <div class="sector-label">${sector.sector}</div>
            <div class="sector-bar" style="width: ${sector.weight}%"></div>
          </div>
          <div class="sector-value">${sector.weight.toFixed(1)}%</div>
        </div>
      `).join('');
    }
  }

  /**
   * Render news feed
   */
  renderNews() {
    const news = this.getPortfolioNews(5);
    const newsElement = document.getElementById('portfolio-news');
    
    if (newsElement) {
      newsElement.innerHTML = news.map(item => `
        <div class="news-item">
          <div class="news-symbol">${item.symbol}</div>
          <div class="news-content">
            <div class="news-headline">${item.headline}</div>
            <div class="news-summary">${item.summary}</div>
            <div class="news-meta">
              <span class="news-sentiment ${item.sentiment}">${item.sentiment}</span>
              <span class="news-source">${item.source}</span>
              <span class="news-time">${this.formatTime(item.timestamp)}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  /**
   * Render market ticker
   */
  renderMarketTicker() {
    const tickerElement = document.getElementById('market-ticker');
    if (!tickerElement) return;
    
    const tickerData = [
      ...this.data.holdings.slice(0, 6).map(h => ({
        symbol: h.symbol,
        price: h.currentPrice,
        change: h.dayChangePercent
      })),
      ...Object.entries(this.market.indices).map(([symbol, data]) => ({
        symbol: symbol.toUpperCase(),
        price: data.value,
        change: data.changePercent
      }))
    ];
    
    tickerElement.innerHTML = `
      <div class="ticker-content">
        ${tickerData.map(item => `
          <div class="ticker-item">
            <span class="ticker-symbol">${item.symbol}</span>
            <span class="ticker-price">$${item.price.toFixed(2)}</span>
            <span class="ticker-change ${item.change >= 0 ? 'positive' : 'negative'}">
              ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Format timestamp for display
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  /**
   * Enable real-time updates (Phase 2+)
   */
  enableRealTime() {
    this.isRealTimeEnabled = true;
    this.updateInterval = setInterval(() => {
      this.fetchRealTimeData();
    }, 60000); // Update every minute
    
    console.log('[Portfolio Manager] Real-time updates enabled');
  }

  /**
   * Disable real-time updates
   */
  disableRealTime() {
    this.isRealTimeEnabled = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('[Portfolio Manager] Real-time updates disabled');
  }

  /**
   * Fetch real-time data (Phase 2+)
   */
  async fetchRealTimeData() {
    if (!this.isRealTimeEnabled) return;
    
    console.log('[Portfolio Manager] Fetching real-time data...');
    // Phase 2: Implement actual API calls
    // For now, simulate small price changes
    this.simulatePriceChanges();
    this.render();
  }

  /**
   * Simulate price changes for development (Phase 1)
   */
  simulatePriceChanges() {
    this.data.holdings.forEach(holding => {
      // Simulate small price movements
      const change = (Math.random() - 0.5) * 0.02; // ±1% max
      holding.currentPrice *= (1 + change);
      holding.dayChange = holding.currentPrice - (holding.currentPrice / (1 + change));
      holding.dayChangePercent = change * 100;
      holding.marketValue = holding.quantity * holding.currentPrice;
    });
    
    this.calculatePortfolioMetrics();
  }

  /**
   * Get portfolio manager instance
   */
  static getInstance() {
    if (!PortfolioManager.instance) {
      PortfolioManager.instance = new PortfolioManager();
    }
    return PortfolioManager.instance;
  }
}

// Export the class and create singleton instance
export default PortfolioManager;
export const portfolioManager = PortfolioManager.getInstance();
