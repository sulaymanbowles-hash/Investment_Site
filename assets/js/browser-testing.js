/*
==========================================================================
INVESTMENT SITE - CROSS-BROWSER COMPATIBILITY TESTING
==========================================================================
Comprehensive browser compatibility and feature detection
==========================================================================
*/

class CrossBrowserTesting {
  constructor() {
    this.browserInfo = {};
    this.supportResults = {};
    this.compatibilityIssues = [];
    
    this.init();
  }

  init() {
    this.detectBrowser();
    this.checkFeatureSupport();
    this.testCSSFeatures();
    this.testJavaScriptFeatures();
    this.generateCompatibilityReport();
  }

  detectBrowser() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    this.browserInfo = {
      userAgent,
      platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0,
      vendor: navigator.vendor,
      vendorSub: navigator.vendorSub,
      productSub: navigator.productSub
    };

    // Browser detection
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      this.browserInfo.name = 'Chrome';
      this.browserInfo.engine = 'Blink';
    } else if (userAgent.includes('Firefox')) {
      this.browserInfo.name = 'Firefox';
      this.browserInfo.engine = 'Gecko';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      this.browserInfo.name = 'Safari';
      this.browserInfo.engine = 'WebKit';
    } else if (userAgent.includes('Edg')) {
      this.browserInfo.name = 'Edge';
      this.browserInfo.engine = 'Blink';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      this.browserInfo.name = 'Opera';
      this.browserInfo.engine = 'Blink';
    } else {
      this.browserInfo.name = 'Unknown';
      this.browserInfo.engine = 'Unknown';
    }

    // Device type detection
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      this.browserInfo.deviceType = 'Mobile';
    } else if (/iPad|Android(?=.*Mobile)/i.test(userAgent)) {
      this.browserInfo.deviceType = 'Tablet';
    } else {
      this.browserInfo.deviceType = 'Desktop';
    }

    // Screen information
    this.browserInfo.screen = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    };

    // Viewport information
    this.browserInfo.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    };
  }

  checkFeatureSupport() {
    this.supportResults = {
      // Core Web APIs
      fetch: typeof fetch !== 'undefined',
      Promise: typeof Promise !== 'undefined',
      IntersectionObserver: typeof IntersectionObserver !== 'undefined',
      PerformanceObserver: typeof PerformanceObserver !== 'undefined',
      
      // Storage APIs
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      indexedDB: typeof indexedDB !== 'undefined',
      
      // Modern JavaScript features
      arrowFunctions: this.testArrowFunctions(),
      constLet: this.testConstLet(),
      templateLiterals: this.testTemplateLiterals(),
      destructuring: this.testDestructuring(),
      asyncAwait: this.testAsyncAwait(),
      
      // CSS Features
      cssGrid: this.testCSSGrid(),
      flexbox: this.testFlexbox(),
      cssVariables: this.testCSSVariables(),
      cssClamp: this.testCSSClamp(),
      
      // Canvas and WebGL
      canvas: this.testCanvas(),
      webGL: this.testWebGL(),
      
      // Media Features
      webP: this.testWebP(),
      videoFormats: this.testVideoFormats(),
      
      // Touch and Pointer Events
      touchEvents: 'ontouchstart' in window,
      pointerEvents: typeof PointerEvent !== 'undefined',
      
      // Service Worker
      serviceWorker: 'serviceWorker' in navigator,
      
      // Geolocation
      geolocation: 'geolocation' in navigator,
      
      // Clipboard API
      clipboard: navigator.clipboard !== undefined,
      
      // Web Animations API
      webAnimations: typeof Element.prototype.animate === 'function'
    };
  }

  testLocalStorage() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  testSessionStorage() {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  testArrowFunctions() {
    try {
      new Function('() => {}');
      return true;
    } catch (e) {
      return false;
    }
  }

  testConstLet() {
    try {
      new Function('const a = 1; let b = 2;');
      return true;
    } catch (e) {
      return false;
    }
  }

  testTemplateLiterals() {
    try {
      new Function('const a = `template ${1} literal`;');
      return true;
    } catch (e) {
      return false;
    }
  }

  testDestructuring() {
    try {
      new Function('const {a} = {a: 1}; const [b] = [2];');
      return true;
    } catch (e) {
      return false;
    }
  }

  testAsyncAwait() {
    try {
      new Function('async function test() { await Promise.resolve(); }');
      return true;
    } catch (e) {
      return false;
    }
  }

  testCSSGrid() {
    const element = document.createElement('div');
    return CSS.supports('display', 'grid') || 
           element.style.display === '' && 
           (element.style.display = 'grid') && 
           element.style.display === 'grid';
  }

  testFlexbox() {
    const element = document.createElement('div');
    return CSS.supports('display', 'flex') || 
           element.style.display === '' && 
           (element.style.display = 'flex') && 
           element.style.display === 'flex';
  }

  testCSSVariables() {
    return CSS.supports('color', 'var(--test)');
  }

  testCSSClamp() {
    return CSS.supports('width', 'clamp(1rem, 2vw, 3rem)');
  }

  testCanvas() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }

  testWebGL() {
    const canvas = document.createElement('canvas');
    try {
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  testWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  testVideoFormats() {
    const video = document.createElement('video');
    return {
      mp4: video.canPlayType('video/mp4') !== '',
      webm: video.canPlayType('video/webm') !== '',
      ogg: video.canPlayType('video/ogg') !== ''
    };
  }

  testCSSFeatures() {
    const cssTests = {
      'CSS Grid': 'display: grid',
      'Flexbox': 'display: flex',
      'CSS Variables': 'color: var(--test)',
      'CSS Calc': 'width: calc(100% - 20px)',
      'CSS Clamp': 'width: clamp(1rem, 2vw, 3rem)',
      'CSS Min/Max': 'width: min(100%, 500px)',
      'Object Fit': 'object-fit: cover',
      'Backdrop Filter': 'backdrop-filter: blur(10px)',
      'CSS Shapes': 'shape-outside: circle()',
      'CSS Scroll Snap': 'scroll-snap-type: x mandatory',
      'CSS Sticky': 'position: sticky',
      'CSS Transforms': 'transform: rotate(45deg)',
      'CSS Transitions': 'transition: all 0.3s ease',
      'CSS Animations': 'animation: spin 1s linear infinite'
    };

    const cssSupport = {};
    
    Object.entries(cssTests).forEach(([feature, property]) => {
      cssSupport[feature] = CSS.supports(property);
    });

    this.supportResults.cssFeatures = cssSupport;
  }

  testJavaScriptFeatures() {
    const jsTests = {
      'ES6 Classes': () => {
        try {
          new Function('class Test {}');
          return true;
        } catch (e) {
          return false;
        }
      },
      'ES6 Modules': () => typeof module !== 'undefined' && module.exports,
      'Array.from': () => typeof Array.from === 'function',
      'Array.includes': () => typeof Array.prototype.includes === 'function',
      'Object.assign': () => typeof Object.assign === 'function',
      'Object.keys': () => typeof Object.keys === 'function',
      'JSON.parse': () => typeof JSON.parse === 'function',
      'RegExp': () => typeof RegExp === 'function',
      'WeakMap': () => typeof WeakMap === 'function',
      'WeakSet': () => typeof WeakSet === 'function',
      'Map': () => typeof Map === 'function',
      'Set': () => typeof Set === 'function',
      'Symbol': () => typeof Symbol === 'function',
      'Proxy': () => typeof Proxy === 'function'
    };

    const jsSupport = {};
    
    Object.entries(jsTests).forEach(([feature, test]) => {
      try {
        jsSupport[feature] = test();
      } catch (e) {
        jsSupport[feature] = false;
      }
    });

    this.supportResults.jsFeatures = jsSupport;
  }

  checkCompatibilityIssues() {
    this.compatibilityIssues = [];

    // Check for critical missing features
    const criticalFeatures = [
      'fetch',
      'Promise',
      'localStorage',
      'cssGrid',
      'flexbox'
    ];

    criticalFeatures.forEach(feature => {
      if (!this.supportResults[feature]) {
        this.compatibilityIssues.push({
          type: 'critical',
          feature,
          message: `${feature} is not supported - site may not function properly`,
          recommendation: 'Consider adding polyfills or fallbacks'
        });
      }
    });

    // Check for nice-to-have features
    const enhancementFeatures = [
      'IntersectionObserver',
      'webAnimations',
      'serviceWorker'
    ];

    enhancementFeatures.forEach(feature => {
      if (!this.supportResults[feature]) {
        this.compatibilityIssues.push({
          type: 'warning',
          feature,
          message: `${feature} is not supported - some enhancements may not work`,
          recommendation: 'Feature will gracefully degrade'
        });
      }
    });

    // Browser-specific issues
    if (this.browserInfo.name === 'Safari') {
      this.compatibilityIssues.push({
        type: 'info',
        feature: 'Safari Specific',
        message: 'Safari has unique behavior for some CSS and JS features',
        recommendation: 'Test thoroughly on Safari'
      });
    }

    if (this.browserInfo.name === 'Internet Explorer') {
      this.compatibilityIssues.push({
        type: 'critical',
        feature: 'Internet Explorer',
        message: 'Internet Explorer is not supported',
        recommendation: 'Upgrade to a modern browser'
      });
    }

    // Mobile-specific checks
    if (this.browserInfo.deviceType === 'Mobile') {
      if (!this.supportResults.touchEvents) {
        this.compatibilityIssues.push({
          type: 'warning',
          feature: 'Touch Events',
          message: 'Touch events not supported on mobile device',
          recommendation: 'Check device compatibility'
        });
      }
    }
  }

  generateCompatibilityReport() {
    this.checkCompatibilityIssues();

    const report = {
      browser: this.browserInfo,
      features: this.supportResults,
      issues: this.compatibilityIssues,
      score: this.calculateCompatibilityScore(),
      timestamp: new Date().toISOString()
    };

    console.log('\n🌐 BROWSER COMPATIBILITY REPORT');
    console.log('================================');
    console.log(`Browser: ${this.browserInfo.name} on ${this.browserInfo.platform}`);
    console.log(`Device Type: ${this.browserInfo.deviceType}`);
    console.log(`Compatibility Score: ${report.score}/100`);
    
    if (this.compatibilityIssues.length > 0) {
      console.log('\n⚠️ COMPATIBILITY ISSUES:');
      this.compatibilityIssues.forEach(issue => {
        const icon = issue.type === 'critical' ? '🚨' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon} ${issue.message}`);
      });
    } else {
      console.log('\n✅ No compatibility issues detected');
    }

    return report;
  }

  calculateCompatibilityScore() {
    const totalFeatures = Object.keys(this.supportResults).length;
    const supportedFeatures = Object.values(this.supportResults).filter(Boolean).length;
    
    let baseScore = (supportedFeatures / totalFeatures) * 100;
    
    // Deduct points for critical issues
    const criticalIssues = this.compatibilityIssues.filter(i => i.type === 'critical').length;
    const warningIssues = this.compatibilityIssues.filter(i => i.type === 'warning').length;
    
    baseScore -= (criticalIssues * 20);
    baseScore -= (warningIssues * 5);
    
    return Math.max(0, Math.round(baseScore));
  }

  createCompatibilityBadge() {
    if (window.location.search.includes('compat=true')) {
      const badge = document.createElement('div');
      badge.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 25px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        cursor: pointer;
        transition: transform 0.2s ease;
      `;

      const score = this.calculateCompatibilityScore();
      const color = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
      
      badge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%;"></div>
          <span>${this.browserInfo.name} ${score}%</span>
        </div>
      `;

      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.05)';
      });

      badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
      });

      badge.addEventListener('click', () => {
        console.log(this.generateCompatibilityReport());
      });

      document.body.appendChild(badge);
    }
  }

  // Feature detection polyfills
  addPolyfills() {
    // Add polyfills for missing features
    if (!this.supportResults.fetch) {
      console.warn('Fetch API not supported - consider adding a polyfill');
    }

    if (!this.supportResults.Promise) {
      console.warn('Promises not supported - consider adding a polyfill');
    }

    if (!this.supportResults.IntersectionObserver) {
      console.warn('IntersectionObserver not supported - animations may not work properly');
    }

    // Add CSS fallbacks
    if (!this.supportResults.cssGrid) {
      document.documentElement.classList.add('no-grid');
    }

    if (!this.supportResults.flexbox) {
      document.documentElement.classList.add('no-flexbox');
    }

    if (!this.supportResults.cssVariables) {
      document.documentElement.classList.add('no-css-vars');
    }
  }
}

// Initialize cross-browser testing
document.addEventListener('DOMContentLoaded', () => {
  window.crossBrowserTesting = new CrossBrowserTesting();
  window.crossBrowserTesting.createCompatibilityBadge();
  window.crossBrowserTesting.addPolyfills();
});

// Export for global access
window.CrossBrowserTesting = CrossBrowserTesting;
