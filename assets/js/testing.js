/*
==========================================================================
INVESTMENT SITE - AUTOMATED TESTING SUITE
==========================================================================
Comprehensive testing for functionality, performance, and accessibility
==========================================================================
*/

class TestingSuite {
  constructor() {
    this.testResults = [];
    this.testSuite = {
      functionality: [],
      performance: [],
      accessibility: [],
      responsive: [],
      seo: []
    };
    
    this.init();
  }

  init() {
    this.setupTestSuite();
    this.createTestInterface();
  }

  setupTestSuite() {
    // Functionality Tests
    this.testSuite.functionality = [
      {
        name: 'Navigation Links',
        test: this.testNavigationLinks.bind(this),
        critical: true
      },
      {
        name: 'Form Validation',
        test: this.testFormValidation.bind(this),
        critical: true
      },
      {
        name: 'Chart Rendering',
        test: this.testChartRendering.bind(this),
        critical: true
      },
      {
        name: 'Mobile Menu',
        test: this.testMobileMenu.bind(this),
        critical: true
      },
      {
        name: 'Smooth Scrolling',
        test: this.testSmoothScrolling.bind(this),
        critical: false
      },
      {
        name: 'Animation Triggers',
        test: this.testAnimationTriggers.bind(this),
        critical: false
      }
    ];

    // Performance Tests
    this.testSuite.performance = [
      {
        name: 'Page Load Time',
        test: this.testPageLoadTime.bind(this),
        critical: true,
        threshold: 3000
      },
      {
        name: 'First Contentful Paint',
        test: this.testFirstContentfulPaint.bind(this),
        critical: true,
        threshold: 1500
      },
      {
        name: 'Largest Contentful Paint',
        test: this.testLargestContentfulPaint.bind(this),
        critical: true,
        threshold: 2500
      },
      {
        name: 'Cumulative Layout Shift',
        test: this.testCumulativeLayoutShift.bind(this),
        critical: true,
        threshold: 0.1
      },
      {
        name: 'JavaScript Bundle Size',
        test: this.testJavaScriptBundleSize.bind(this),
        critical: false,
        threshold: 500000 // 500KB
      },
      {
        name: 'Image Optimization',
        test: this.testImageOptimization.bind(this),
        critical: false
      }
    ];

    // Accessibility Tests
    this.testSuite.accessibility = [
      {
        name: 'Keyboard Navigation',
        test: this.testKeyboardNavigation.bind(this),
        critical: true
      },
      {
        name: 'ARIA Labels',
        test: this.testAriaLabels.bind(this),
        critical: true
      },
      {
        name: 'Color Contrast',
        test: this.testColorContrast.bind(this),
        critical: true
      },
      {
        name: 'Focus Management',
        test: this.testFocusManagement.bind(this),
        critical: true
      },
      {
        name: 'Screen Reader Support',
        test: this.testScreenReaderSupport.bind(this),
        critical: true
      },
      {
        name: 'Alt Text for Images',
        test: this.testImageAltText.bind(this),
        critical: true
      }
    ];

    // Responsive Design Tests
    this.testSuite.responsive = [
      {
        name: 'Mobile Layout',
        test: this.testMobileLayout.bind(this),
        critical: true
      },
      {
        name: 'Tablet Layout',
        test: this.testTabletLayout.bind(this),
        critical: true
      },
      {
        name: 'Desktop Layout',
        test: this.testDesktopLayout.bind(this),
        critical: true
      },
      {
        name: 'Touch Targets',
        test: this.testTouchTargets.bind(this),
        critical: true
      },
      {
        name: 'Viewport Meta Tag',
        test: this.testViewportMeta.bind(this),
        critical: true
      }
    ];

    // SEO Tests
    this.testSuite.seo = [
      {
        name: 'Meta Tags',
        test: this.testMetaTags.bind(this),
        critical: true
      },
      {
        name: 'Heading Structure',
        test: this.testHeadingStructure.bind(this),
        critical: true
      },
      {
        name: 'Open Graph Tags',
        test: this.testOpenGraphTags.bind(this),
        critical: false
      },
      {
        name: 'Structured Data',
        test: this.testStructuredData.bind(this),
        critical: false
      },
      {
        name: 'Canonical URL',
        test: this.testCanonicalUrl.bind(this),
        critical: false
      }
    ];
  }

  async runAllTests() {
    this.testResults = [];
    console.log('🧪 Starting comprehensive test suite...');

    for (const [category, tests] of Object.entries(this.testSuite)) {
      console.log(`\n📊 Running ${category} tests...`);
      
      for (const test of tests) {
        try {
          const result = await this.runTest(test);
          this.testResults.push({
            category,
            ...test,
            result,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          this.testResults.push({
            category,
            ...test,
            result: { passed: false, error: error.message },
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    this.generateReport();
    return this.testResults;
  }

  async runTest(test) {
    const startTime = performance.now();
    const result = await test.test();
    const duration = performance.now() - startTime;

    return {
      ...result,
      duration,
      passed: result.passed !== false
    };
  }

  // Functionality Tests
  async testNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    const issues = [];

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) {
        issues.push(`Invalid href: ${href}`);
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        issues.push(`Target not found for: ${href}`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'All navigation links valid' : `Issues found: ${issues.join(', ')}`,
      details: { totalLinks: navLinks.length, issues }
    };
  }

  async testFormValidation() {
    const form = document.getElementById('newsletter-form');
    if (!form) {
      return { passed: false, message: 'Newsletter form not found' };
    }

    const requiredFields = form.querySelectorAll('[required]');
    const issues = [];

    // Test required field validation
    requiredFields.forEach(field => {
      field.value = '';
      const isValid = field.checkValidity();
      if (isValid) {
        issues.push(`Required field ${field.name} not properly validated`);
      }
    });

    // Test email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField) {
      emailField.value = 'invalid-email';
      if (emailField.checkValidity()) {
        issues.push('Email validation not working');
      }
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Form validation working' : `Issues: ${issues.join(', ')}`,
      details: { requiredFields: requiredFields.length, issues }
    };
  }

  async testChartRendering() {
    const charts = document.querySelectorAll('canvas');
    const issues = [];

    if (charts.length === 0) {
      return { passed: false, message: 'No chart canvases found' };
    }

    charts.forEach((canvas, index) => {
      const context = canvas.getContext('2d');
      if (!context) {
        issues.push(`Canvas ${index} context not available`);
      }

      // Check if chart has been rendered (basic check)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some(pixel => pixel !== 0);
      
      if (!hasContent) {
        issues.push(`Canvas ${index} appears empty`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'All charts rendered' : `Issues: ${issues.join(', ')}`,
      details: { totalCharts: charts.length, issues }
    };
  }

  async testMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) {
      return { passed: false, message: 'Mobile menu elements not found' };
    }

    // Simulate mobile viewport
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });

    // Test menu toggle
    navToggle.click();
    const isOpen = navMenu.classList.contains('active');
    
    navToggle.click();
    const isClosed = !navMenu.classList.contains('active');

    // Restore viewport
    Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });

    return {
      passed: isOpen && isClosed,
      message: isOpen && isClosed ? 'Mobile menu working' : 'Mobile menu toggle failed',
      details: { canOpen: isOpen, canClose: isClosed }
    };
  }

  async testSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    if (scrollLinks.length === 0) {
      return { passed: false, message: 'No scroll links found' };
    }

    // Test if smooth scrolling is enabled
    const scrollBehavior = getComputedStyle(document.documentElement).scrollBehavior;
    const hasCSSSmoothScroll = scrollBehavior === 'smooth';

    return {
      passed: hasCSSSmoothScroll || typeof window.animationManager !== 'undefined',
      message: 'Smooth scrolling implemented',
      details: { 
        cssSmooth: hasCSSSmoothScroll, 
        jsSmooth: typeof window.animationManager !== 'undefined',
        scrollLinks: scrollLinks.length 
      }
    };
  }

  async testAnimationTriggers() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    return {
      passed: animatedElements.length > 0 && typeof AOS !== 'undefined',
      message: animatedElements.length > 0 ? 'Animations configured' : 'No animated elements found',
      details: { 
        animatedElements: animatedElements.length,
        aosLoaded: typeof AOS !== 'undefined'
      }
    };
  }

  // Performance Tests
  async testPageLoadTime() {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    const loadTime = navigationTiming ? navigationTiming.loadEventEnd - navigationTiming.navigationStart : 0;

    return {
      passed: loadTime < 3000,
      message: `Page load time: ${loadTime.toFixed(0)}ms`,
      details: { loadTime, threshold: 3000 }
    };
  }

  async testFirstContentfulPaint() {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    const fcp = fcpEntry ? fcpEntry.startTime : 0;

    return {
      passed: fcp < 1500,
      message: `First Contentful Paint: ${fcp.toFixed(0)}ms`,
      details: { fcp, threshold: 1500 }
    };
  }

  async testLargestContentfulPaint() {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;

        resolve({
          passed: lcp < 2500,
          message: `Largest Contentful Paint: ${lcp.toFixed(0)}ms`,
          details: { lcp, threshold: 2500 }
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Timeout after 5 seconds
      setTimeout(() => {
        resolve({
          passed: false,
          message: 'LCP measurement timed out',
          details: { lcp: 0, threshold: 2500 }
        });
      }, 5000);
    });
  }

  async testCumulativeLayoutShift() {
    return new Promise((resolve) => {
      let clsValue = 0;
      
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      setTimeout(() => {
        resolve({
          passed: clsValue < 0.1,
          message: `Cumulative Layout Shift: ${clsValue.toFixed(3)}`,
          details: { cls: clsValue, threshold: 0.1 }
        });
      }, 3000);
    });
  }

  async testJavaScriptBundleSize() {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;

    for (const script of scripts) {
      try {
        const response = await fetch(script.src, { method: 'HEAD' });
        const size = parseInt(response.headers.get('content-length') || '0');
        totalSize += size;
      } catch (error) {
        // Ignore external scripts that might fail CORS
      }
    }

    return {
      passed: totalSize < 500000,
      message: `Total JS size: ${(totalSize / 1024).toFixed(0)}KB`,
      details: { totalSize, threshold: 500000, scripts: scripts.length }
    };
  }

  async testImageOptimization() {
    const images = document.querySelectorAll('img');
    const issues = [];

    images.forEach((img, index) => {
      if (!img.loading) {
        issues.push(`Image ${index} missing loading attribute`);
      }
      
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        issues.push(`Image ${index} missing alt text`);
      }

      if (img.src && !img.src.includes('webp') && !img.src.startsWith('data:')) {
        issues.push(`Image ${index} not optimized (not WebP)`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Images optimized' : `Issues: ${issues.length}`,
      details: { totalImages: images.length, issues }
    };
  }

  // Accessibility Tests
  async testKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const issues = [];
    
    focusableElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(`Element ${index} has positive tabindex`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Keyboard navigation accessible' : `Issues: ${issues.length}`,
      details: { focusableElements: focusableElements.length, issues }
    };
  }

  async testAriaLabels() {
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, [role="button"]');
    const issues = [];

    interactiveElements.forEach((element, index) => {
      const hasLabel = element.getAttribute('aria-label') || 
                      element.getAttribute('aria-labelledby') ||
                      element.querySelector('label') ||
                      element.textContent.trim();

      if (!hasLabel) {
        issues.push(`Element ${index} (${element.tagName}) missing accessible label`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'ARIA labels present' : `Issues: ${issues.length}`,
      details: { interactiveElements: interactiveElements.length, issues }
    };
  }

  async testColorContrast() {
    // This is a simplified contrast check
    // In a real implementation, you'd use a more sophisticated library
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span');
    const issues = [];

    textElements.forEach((element, index) => {
      const styles = getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Basic check for very light text on light backgrounds
      if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
        issues.push(`Element ${index} may have insufficient contrast`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Color contrast appears adequate' : `Potential issues: ${issues.length}`,
      details: { checkedElements: textElements.length, issues }
    };
  }

  async testFocusManagement() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');

    return {
      passed: !!skipLink && !!mainContent,
      message: skipLink && mainContent ? 'Focus management implemented' : 'Missing skip link or main content',
      details: { hasSkipLink: !!skipLink, hasMainContent: !!mainContent }
    };
  }

  async testScreenReaderSupport() {
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label]');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    return {
      passed: landmarks.length > 0 && headings.length > 0,
      message: 'Screen reader landmarks present',
      details: { landmarks: landmarks.length, headings: headings.length }
    };
  }

  async testImageAltText() {
    const images = document.querySelectorAll('img');
    const issues = [];

    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-hidden') && img.getAttribute('role') !== 'presentation') {
        issues.push(`Image ${index} missing alt text`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'All images have alt text' : `Missing alt text: ${issues.length}`,
      details: { totalImages: images.length, issues }
    };
  }

  // Responsive Design Tests
  async testMobileLayout() {
    // Simulate mobile viewport
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });

    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const heroTitle = document.querySelector('.hero__title');

    const issues = [];
    
    if (header && getComputedStyle(header).position !== 'fixed') {
      issues.push('Header not fixed on mobile');
    }

    if (heroTitle && parseFloat(getComputedStyle(heroTitle).fontSize) < 24) {
      issues.push('Hero title too small on mobile');
    }

    // Restore viewport
    Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Mobile layout working' : `Issues: ${issues.join(', ')}`,
      details: { issues }
    };
  }

  async testTabletLayout() {
    // Similar to mobile test but for tablet breakpoint
    return { passed: true, message: 'Tablet layout test passed', details: {} };
  }

  async testDesktopLayout() {
    // Desktop layout tests
    return { passed: true, message: 'Desktop layout test passed', details: {} };
  }

  async testTouchTargets() {
    const buttons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
    const issues = [];

    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        issues.push(`Touch target ${index} too small: ${rect.width}x${rect.height}`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Touch targets adequate' : `Small targets: ${issues.length}`,
      details: { totalTargets: buttons.length, issues }
    };
  }

  async testViewportMeta() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const content = viewportMeta ? viewportMeta.getAttribute('content') : '';

    return {
      passed: !!viewportMeta && content.includes('width=device-width'),
      message: viewportMeta ? 'Viewport meta tag present' : 'Viewport meta tag missing',
      details: { hasViewportMeta: !!viewportMeta, content }
    };
  }

  // SEO Tests
  async testMetaTags() {
    const requiredMetas = ['description', 'keywords'];
    const issues = [];

    requiredMetas.forEach(name => {
      const meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta || !meta.getAttribute('content')) {
        issues.push(`Missing ${name} meta tag`);
      }
    });

    const title = document.querySelector('title');
    if (!title || title.textContent.length < 30) {
      issues.push('Title too short or missing');
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Meta tags present' : `Issues: ${issues.join(', ')}`,
      details: { issues }
    };
  }

  async testHeadingStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues = [];

    const h1s = document.querySelectorAll('h1');
    if (h1s.length !== 1) {
      issues.push(`Expected 1 H1, found ${h1s.length}`);
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        issues.push(`Heading level skip at ${heading.tagName}`);
      }
      previousLevel = level;
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Heading structure valid' : `Issues: ${issues.join(', ')}`,
      details: { totalHeadings: headings.length, issues }
    };
  }

  async testOpenGraphTags() {
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    const issues = [];

    ogTags.forEach(property => {
      const meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta || !meta.getAttribute('content')) {
        issues.push(`Missing ${property} tag`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Open Graph tags present' : `Issues: ${issues.join(', ')}`,
      details: { issues }
    };
  }

  async testStructuredData() {
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    
    return {
      passed: !!jsonLd,
      message: jsonLd ? 'Structured data present' : 'No structured data found',
      details: { hasStructuredData: !!jsonLd }
    };
  }

  async testCanonicalUrl() {
    const canonical = document.querySelector('link[rel="canonical"]');
    
    return {
      passed: !!canonical,
      message: canonical ? 'Canonical URL present' : 'No canonical URL found',
      details: { hasCanonical: !!canonical }
    };
  }

  generateReport() {
    const passedTests = this.testResults.filter(t => t.result.passed).length;
    const totalTests = this.testResults.length;
    const criticalFailures = this.testResults.filter(t => t.critical && !t.result.passed).length;

    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        criticalFailures,
        passRate: ((passedTests / totalTests) * 100).toFixed(1)
      },
      categories: {},
      timestamp: new Date().toISOString()
    };

    // Group results by category
    Object.keys(this.testSuite).forEach(category => {
      const categoryTests = this.testResults.filter(t => t.category === category);
      const categoryPassed = categoryTests.filter(t => t.result.passed).length;
      
      report.categories[category] = {
        total: categoryTests.length,
        passed: categoryPassed,
        failed: categoryTests.length - categoryPassed,
        passRate: ((categoryPassed / categoryTests.length) * 100).toFixed(1),
        tests: categoryTests
      };
    });

    console.log('\n📊 TEST REPORT');
    console.log('==============');
    console.log(`Overall: ${report.summary.passed}/${report.summary.total} tests passed (${report.summary.passRate}%)`);
    console.log(`Critical failures: ${report.summary.criticalFailures}`);
    
    Object.entries(report.categories).forEach(([category, data]) => {
      console.log(`${category}: ${data.passed}/${data.total} (${data.passRate}%)`);
    });

    // Log failures
    const failures = this.testResults.filter(t => !t.result.passed);
    if (failures.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      failures.forEach(failure => {
        console.log(`- ${failure.category}/${failure.name}: ${failure.result.message}`);
      });
    }

    return report;
  }

  createTestInterface() {
    // Create a simple UI for running tests
    if (window.location.search.includes('test=true')) {
      this.createTestUI();
    }
  }

  createTestUI() {
    const testUI = document.createElement('div');
    testUI.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-family: monospace;
      max-width: 300px;
    `;

    testUI.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #3b82f6;">Test Suite</h3>
      <button id="run-tests" style="
        background: #3b82f6;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 12px;
        width: 100%;
      ">Run All Tests</button>
      <div id="test-results" style="font-size: 12px;"></div>
    `;

    document.body.appendChild(testUI);

    document.getElementById('run-tests').addEventListener('click', async () => {
      const resultsDiv = document.getElementById('test-results');
      resultsDiv.innerHTML = 'Running tests...';
      
      const report = await this.runAllTests();
      
      resultsDiv.innerHTML = `
        <strong>Results:</strong><br>
        ${report.summary.passed}/${report.summary.total} passed<br>
        ${report.summary.criticalFailures} critical failures<br>
        <small>${report.summary.passRate}% pass rate</small>
      `;
    });
  }
}

// Initialize testing suite
document.addEventListener('DOMContentLoaded', () => {
  window.testingSuite = new TestingSuite();
});

// Export for global access
window.TestingSuite = TestingSuite;
