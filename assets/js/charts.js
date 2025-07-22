/*
==========================================================================
INVESTMENT SITE - CHARTS & DATA VISUALIZATION
==========================================================================
Advanced chart implementations using Chart.js for financial data display
==========================================================================
*/

class ChartManager {
  constructor() {
    this.charts = {};
    this.chartOptions = this.getDefaultOptions();
    this.init();
  }

  init() {
    // Wait for Chart.js to be available
    if (typeof Chart !== 'undefined') {
      this.setupCharts();
    } else {
      // Retry after a short delay
      setTimeout(() => this.init(), 100);
    }
  }

  getDefaultOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutCubic',
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default') {
            delay = context.dataIndex * 50 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: false
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(13, 148, 136, 0.5)',
          borderWidth: 2,
          cornerRadius: 12,
          padding: 16,
          displayColors: true,
          usePointStyle: true,
          titleFont: {
            size: 14,
            weight: '600',
            family: 'Inter, sans-serif'
          },
          bodyFont: {
            size: 13,
            family: 'JetBrains Mono, monospace'
          },
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0].label;
            },
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 6
        },
        line: {
          borderWidth: 2,
          tension: 0.4
        }
      }
    };
  }

  setupCharts() {
    this.createHeroChart();
    this.createMiniCharts();
    this.createAllocationChart();
    this.createPerformanceChart();
  }

  createHeroChart() {
    const ctx = document.getElementById('hero-chart');
    if (!ctx) return;

    // Generate sample data for market performance
    const data = this.generateMarketData(30);
    
    this.charts.hero = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Portfolio Value',
          data: data.values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        ...this.chartOptions,
        plugins: {
          ...this.chartOptions.plugins,
          tooltip: {
            ...this.chartOptions.plugins.tooltip,
            callbacks: {
              title: (context) => {
                return `Day ${context[0].dataIndex + 1}`;
              },
              label: (context) => {
                return `Portfolio: $${context.parsed.y.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(156, 163, 175, 0.1)',
              borderDash: [5, 5]
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              },
              callback: function(value) {
                return '$' + (value / 1000).toFixed(0) + 'K';
              }
            }
          }
        }
      }
    });

    // Animate the chart on scroll
    this.animateChartOnScroll(this.charts.hero);
  }

  createMiniCharts() {
    const miniChartIds = ['sp500-chart', 'nasdaq-chart', 'dow-chart', 'btc-chart'];
    const miniChartData = [
      { trend: 'up', volatility: 0.02 },
      { trend: 'up', volatility: 0.03 },
      { trend: 'down', volatility: 0.015 },
      { trend: 'up', volatility: 0.05 }
    ];

    miniChartIds.forEach((id, index) => {
      const ctx = document.getElementById(id);
      if (!ctx) return;

      const data = this.generateMiniChartData(20, miniChartData[index]);
      
      this.charts[id] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.values,
            borderColor: data.trend === 'up' ? '#059669' : '#dc2626',
            backgroundColor: data.trend === 'up' ? 
              'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          ...this.chartOptions,
          plugins: {
            tooltip: {
              enabled: false
            }
          }
        }
      });
    });
  }

  createAllocationChart() {
    const ctx = document.getElementById('allocation-chart');
    if (!ctx) return;

    const allocations = [
      { label: 'Technology', value: 35, color: '#3b82f6' },
      { label: 'Healthcare', value: 20, color: '#059669' },
      { label: 'Finance', value: 15, color: '#f59e0b' },
      { label: 'Energy', value: 12, color: '#8b5cf6' },
      { label: 'Consumer', value: 10, color: '#06b6d4' },
      { label: 'Other', value: 8, color: '#6b7280' }
    ];

    this.charts.allocation = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: allocations.map(a => a.label),
        datasets: [{
          data: allocations.map(a => a.value),
          backgroundColor: allocations.map(a => a.color),
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
                weight: '500'
              },
              color: '#374151'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#f9fafb',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  createPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;

    const performanceData = this.generatePerformanceData(12);
    
    this.charts.performance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: performanceData.labels,
        datasets: [
          {
            label: 'Portfolio',
            data: performanceData.portfolio,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'S&P 500',
            data: performanceData.sp500,
            borderColor: '#6b7280',
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: '500'
              },
              color: '#374151'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#f9fafb',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                const sign = value >= 0 ? '+' : '';
                return `${context.dataset.label}: ${sign}${value.toFixed(2)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(156, 163, 175, 0.1)',
              borderDash: [2, 2]
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(156, 163, 175, 0.1)',
              borderDash: [2, 2]
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 11
              },
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  generateMarketData(days) {
    const labels = [];
    const values = [];
    let currentValue = 2500000; // Starting portfolio value

    for (let i = 0; i < days; i++) {
      labels.push(i + 1);
      
      // Simulate market movement with slight upward bias
      const change = (Math.random() - 0.45) * 0.03; // Slight positive bias
      currentValue *= (1 + change);
      values.push(Math.round(currentValue));
    }

    return { labels, values };
  }

  generateMiniChartData(points, config) {
    const labels = [];
    const values = [];
    let currentValue = 100;
    
    for (let i = 0; i < points; i++) {
      labels.push(i);
      
      // Apply trend and volatility
      const trendFactor = config.trend === 'up' ? 0.001 : -0.001;
      const volatility = (Math.random() - 0.5) * config.volatility;
      const change = trendFactor + volatility;
      
      currentValue *= (1 + change);
      values.push(currentValue);
    }

    return { 
      labels, 
      values, 
      trend: config.trend 
    };
  }

  generatePerformanceData(months) {
    const labels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ].slice(0, months);
    
    const portfolio = [];
    const sp500 = [];
    
    let portfolioValue = 0;
    let sp500Value = 0;
    
    for (let i = 0; i < months; i++) {
      // Portfolio typically outperforms with higher volatility
      const portfolioChange = (Math.random() - 0.4) * 8; // Slight positive bias
      const sp500Change = (Math.random() - 0.45) * 6; // Market average
      
      portfolioValue += portfolioChange;
      sp500Value += sp500Change;
      
      portfolio.push(Number(portfolioValue.toFixed(2)));
      sp500.push(Number(sp500Value.toFixed(2)));
    }
    
    return { labels, portfolio, sp500 };
  }

  updatePerformanceChart(period) {
    if (!this.charts.performance) return;

    const dataPoints = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      'ALL': 1000
    };

    const points = dataPoints[period] || 30;
    const months = period === '1M' ? 1 : period === '3M' ? 3 : period === '6M' ? 6 : period === '1Y' ? 12 : 24;
    
    const newData = this.generatePerformanceData(months);
    
    // Animate the transition
    this.charts.performance.data.labels = newData.labels;
    this.charts.performance.data.datasets[0].data = newData.portfolio;
    this.charts.performance.data.datasets[1].data = newData.sp500;
    
    this.charts.performance.update('active');
  }

  animateChartOnScroll(chart) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !chart.animated) {
          chart.animated = true;
          
          // Animate chart data
          const originalData = [...chart.data.datasets[0].data];
          chart.data.datasets[0].data = chart.data.datasets[0].data.map(() => 0);
          chart.update('none');
          
          // Animate to actual values
          const duration = 2000;
          const startTime = Date.now();
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            chart.data.datasets[0].data = originalData.map(value => 
              Math.round(value * easeOutCubic)
            );
            chart.update('none');
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(chart.canvas.parentElement);
  }

  // Market data simulation methods
  simulateRealTimeUpdates() {
    setInterval(() => {
      this.updateMiniCharts();
    }, 5000); // Update every 5 seconds
  }

  updateMiniCharts() {
    const miniChartIds = ['sp500-chart', 'nasdaq-chart', 'dow-chart', 'btc-chart'];
    
    miniChartIds.forEach(id => {
      const chart = this.charts[id];
      if (!chart) return;
      
      // Remove first data point and add new one
      chart.data.labels.shift();
      chart.data.labels.push(chart.data.labels.length);
      
      const lastValue = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
      const change = (Math.random() - 0.5) * 0.02;
      const newValue = lastValue * (1 + change);
      
      chart.data.datasets[0].data.shift();
      chart.data.datasets[0].data.push(newValue);
      
      chart.update('none');
    });
  }

  // Responsive chart handling
  handleResize() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.resize === 'function') {
        chart.resize();
      }
    });
  }

  // Cleanup method
  destroy() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
  }
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Chart.js to load
  const initCharts = () => {
    if (typeof Chart !== 'undefined') {
      window.chartManager = new ChartManager();
      
      // Enable real-time updates
      setTimeout(() => {
        window.chartManager.simulateRealTimeUpdates();
      }, 3000);
      
    } else {
      setTimeout(initCharts, 100);
    }
  };
  
  initCharts();
});

// Handle window resize
window.addEventListener('resize', () => {
  if (window.chartManager) {
    window.chartManager.handleResize();
  }
});

// Export for global access
window.ChartManager = ChartManager;
