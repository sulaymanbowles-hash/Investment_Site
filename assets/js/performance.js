/*
==========================================================================
INVESTMENT SITE - PERFORMANCE OPTIMIZATION
==========================================================================
Critical performance optimizations for web vitals and user experience
==========================================================================
*/

class PerformanceOptimizer {
  constructor() {
    this.imageObserver = null;
    this.prefetchObserver = null;
    this.metrics = {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0
    };
    
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupPrefetching();
    this.setupCriticalResourceHints();
    this.optimizeImages();
    this.setupPerformanceMonitoring();
    this.optimizeAnimations();
    this.setupServiceWorkerUpdate();
  }

  setupLazyLoading() {
    // Enhanced lazy loading for images
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            this.imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all lazy images
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        this.imageObserver.observe(img);
      });
    }

    // Lazy load non-critical JavaScript
    this.lazyLoadScripts();
  }

  loadImage(img) {
    // Add fade-in effect when image loads
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    const loadHandler = () => {
      img.style.opacity = '1';
      img.removeEventListener('load', loadHandler);
    };
    
    img.addEventListener('load', loadHandler);
    
    // Handle data-src for lazy loading
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  }

  lazyLoadScripts() {
    // Lazy load non-critical scripts
    const lazyScripts = [
      {
        src: '/assets/js/placeholders.js',
        condition: () => document.querySelector('img[src*="/assets/images/"]')
      }
    ];

    lazyScripts.forEach(scriptConfig => {
      if (!scriptConfig.condition || scriptConfig.condition()) {
        this.loadScript(scriptConfig.src);
      }
    });
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  setupPrefetching() {
    // Intelligent prefetching based on user behavior
    this.prefetchObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target;
          const href = link.getAttribute('href');
          
          if (href && href.startsWith('#')) {
            // Prefetch section content
            this.prefetchSectionAssets(href);
          }
        }
      });
    }, {
      rootMargin: '100px 0px'
    });

    // Observe navigation links
    document.querySelectorAll('.nav__link').forEach(link => {
      this.prefetchObserver.observe(link);
    });

    // Prefetch on hover
    this.setupHoverPrefetch();
  }

  setupHoverPrefetch() {
    let hoverTimer;
    
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        this.prefetchLink(link);
      }, 100); // Small delay to avoid excessive prefetching
    });

    document.addEventListener('mouseout', () => {
      clearTimeout(hoverTimer);
    });
  }

  prefetchLink(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.dataset.prefetched) return;
    
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = href;
    document.head.appendChild(prefetchLink);
    
    link.dataset.prefetched = 'true';
  }

  prefetchSectionAssets(sectionId) {
    // Prefetch assets for specific sections
    const assetMap = {
      '#research': ['/assets/images/research-tech.jpg', '/assets/images/research-energy.jpg'],
      '#portfolio': ['chart.js'],
      '#contact': []
    };

    if (assetMap[sectionId]) {
      assetMap[sectionId].forEach(asset => {
        if (asset.endsWith('.jpg') || asset.endsWith('.png')) {
          this.prefetchImage(asset);
        } else {
          this.prefetchScript(asset);
        }
      });
    }
  }

  prefetchImage(src) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  }

  prefetchScript(src) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    link.as = 'script';
    document.head.appendChild(link);
  }

  setupCriticalResourceHints() {
    // Add resource hints for critical assets
    const criticalAssets = [
      { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
      { href: 'https://cdn.jsdelivr.net', rel: 'preconnect' },
      { href: '/assets/css/main.css', rel: 'preload', as: 'style' },
      { href: '/assets/js/main.js', rel: 'preload', as: 'script' }
    ];

    criticalAssets.forEach(asset => {
      if (!document.querySelector(`link[href="${asset.href}"]`)) {
        const link = document.createElement('link');
        Object.assign(link, asset);
        if (asset.rel === 'preconnect') {
          link.crossOrigin = '';
        }
        document.head.appendChild(link);
      }
    });
  }

  optimizeImages() {
    // Convert images to WebP if supported
    if (this.supportsWebP()) {
      this.convertToWebP();
    }

    // Implement responsive images
    this.setupResponsiveImages();
  }

  supportsWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  async convertToWebP() {
    const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".png"]');
    const supportsWebP = await this.supportsWebP();
    
    if (supportsWebP) {
      images.forEach(img => {
        const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
        // In a real implementation, you'd check if WebP version exists
        // For now, we'll use the original images
      });
    }
  }

  setupResponsiveImages() {
    // Add responsive image handling
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.srcset && !img.sizes) {
        // Add basic responsive image attributes
        const src = img.src;
        if (src && !src.startsWith('data:')) {
          // In a real implementation, you'd generate multiple sizes
          img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
        }
      }
    });
  }

  setupPerformanceMonitoring() {
    // Web Vitals monitoring
    this.measureWebVitals();
    
    // Custom performance monitoring
    this.measureCustomMetrics();
    
    // Error tracking
    this.setupErrorTracking();
  }

  measureWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];
      this.metrics.fid = firstInput.processingStart - firstInput.startTime;
      this.reportMetric('FID', this.metrics.fid);
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.cls = clsValue;
      this.reportMetric('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.metrics.fcp = fcp.startTime;
        this.reportMetric('FCP', fcp.startTime);
      }
    }).observe({ entryTypes: ['paint'] });
  }

  measureCustomMetrics() {
    // Hero section load time
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const heroLoadTime = performance.now();
      this.reportMetric('Hero Load Time', heroLoadTime);
    }

    // Chart initialization time
    const chartContainers = document.querySelectorAll('canvas');
    if (chartContainers.length > 0) {
      const chartInitTime = performance.now();
      this.reportMetric('Charts Init Time', chartInitTime);
    }
  }

  reportMetric(name, value) {
    // In a real implementation, send to analytics
    console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    
    // Store for potential optimization decisions
    this.metrics[name.toLowerCase().replace(/\s+/g, '_')] = value;
  }

  setupErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError('Unhandled Promise Rejection', {
        reason: event.reason
      });
    });

    // Resource loading errors
    document.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.reportError('Resource Load Error', {
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          type: event.target.type
        });
      }
    }, true);
  }

  reportError(type, details) {
    console.error(`${type}:`, details);
    // In a real implementation, send to error tracking service
  }

  optimizeAnimations() {
    // Disable animations on low-end devices
    if (this.isLowEndDevice()) {
      this.disableAnimations();
    }

    // Use efficient animation techniques
    this.optimizeScrollAnimations();
  }

  isLowEndDevice() {
    // Detect low-end devices based on various factors
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const deviceMemory = navigator.deviceMemory || 1;

    return (
      hardwareConcurrency < 2 ||
      deviceMemory < 2 ||
      (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'))
    );
  }

  disableAnimations() {
    // Add class to disable animations
    document.documentElement.classList.add('reduce-motion');
    
    // Inject CSS to disable animations
    const style = document.createElement('style');
    style.textContent = `
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  optimizeScrollAnimations() {
    // Use passive event listeners for scroll
    let ticking = false;
    
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Throttled scroll handling
          if (window.animationManager) {
            window.animationManager.handleScroll();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  }

  setupServiceWorkerUpdate() {
    // Handle service worker updates efficiently
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Show update notification
        this.showUpdateNotification();
      });
    }
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #3b82f6;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-size: 14px;
      max-width: 320px;
    `;
    
    notification.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: 600;">Update Available</div>
      <div style="margin-bottom: 12px; opacity: 0.9;">A new version of the site is available.</div>
      <button onclick="window.location.reload()" style="
        background: white;
        color: #3b82f6;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
      ">Update Now</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  // Performance budget monitoring
  checkPerformanceBudget() {
    const budgets = {
      fcp: 1500, // 1.5s
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1   // 0.1
    };

    Object.entries(budgets).forEach(([metric, budget]) => {
      if (this.metrics[metric] && this.metrics[metric] > budget) {
        console.warn(`Performance budget exceeded for ${metric.toUpperCase()}: ${this.metrics[metric]}ms (budget: ${budget}ms)`);
      }
    });
  }

  // Cleanup method
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    if (this.prefetchObserver) {
      this.prefetchObserver.disconnect();
    }
  }
}

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', () => {
  window.performanceOptimizer = new PerformanceOptimizer();
});

// Check performance budget after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    if (window.performanceOptimizer) {
      window.performanceOptimizer.checkPerformanceBudget();
    }
  }, 3000);
});

// Export for global access
window.PerformanceOptimizer = PerformanceOptimizer;
