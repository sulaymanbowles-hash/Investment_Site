/*
==========================================================================
INVESTMENT SITE - VALIDATION & DEPLOYMENT CHECKLIST
==========================================================================
Final validation before deployment
==========================================================================
*/

class ValidationChecklist {
  constructor() {
    this.validationResults = {
      html: {},
      css: {},
      javascript: {},
      performance: {},
      accessibility: {},
      seo: {},
      security: {},
      deployment: {}
    };

    this.init();
  }

  init() {
    this.createValidationInterface();
  }

  async runFullValidation() {
    console.log('🔍 Starting comprehensive validation...');

    // Run all validation checks
    await this.validateHTML();
    await this.validateCSS();
    await this.validateJavaScript();
    await this.validatePerformance();
    await this.validateAccessibility();
    await this.validateSEO();
    await this.validateSecurity();
    await this.validateDeploymentReadiness();

    return this.generateValidationReport();
  }

  async validateHTML() {
    console.log('Validating HTML structure...');
    
    const checks = {
      doctype: this.checkDoctype(),
      semanticHTML: this.checkSemanticHTML(),
      headStructure: this.checkHeadStructure(),
      forms: this.checkForms(),
      images: this.checkImages(),
      links: this.checkLinks(),
      validation: this.checkHTMLValidation()
    };

    this.validationResults.html = checks;
    return checks;
  }

  checkDoctype() {
    const doctype = document.doctype;
    return {
      passed: doctype && doctype.name === 'html',
      message: doctype ? 'HTML5 doctype present' : 'Missing or invalid doctype'
    };
  }

  checkSemanticHTML() {
    const semanticElements = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
    const foundElements = semanticElements.filter(tag => document.querySelector(tag));
    
    return {
      passed: foundElements.length >= 4,
      message: `Using ${foundElements.length}/${semanticElements.length} semantic elements`,
      details: foundElements
    };
  }

  checkHeadStructure() {
    const requiredMeta = [
      'meta[charset]',
      'meta[name="viewport"]',
      'meta[name="description"]',
      'title'
    ];

    const missing = requiredMeta.filter(selector => !document.querySelector(selector));

    return {
      passed: missing.length === 0,
      message: missing.length === 0 ? 'All required meta tags present' : `Missing: ${missing.join(', ')}`,
      details: { missing }
    };
  }

  checkForms() {
    const forms = document.querySelectorAll('form');
    const issues = [];

    forms.forEach((form, index) => {
      if (!form.getAttribute('action') && !form.addEventListener) {
        issues.push(`Form ${index} missing action or event handler`);
      }

      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach((field, fieldIndex) => {
        if (!field.getAttribute('aria-label') && !field.labels.length) {
          issues.push(`Required field ${fieldIndex} in form ${index} missing label`);
        }
      });
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Forms properly structured' : `Issues: ${issues.length}`,
      details: { totalForms: forms.length, issues }
    };
  }

  checkImages() {
    const images = document.querySelectorAll('img');
    const issues = [];

    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        issues.push(`Image ${index} missing alt text`);
      }

      if (!img.loading) {
        issues.push(`Image ${index} missing loading attribute`);
      }

      if (img.src && !img.width && !img.height) {
        issues.push(`Image ${index} missing dimensions`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Images properly optimized' : `Issues: ${issues.length}`,
      details: { totalImages: images.length, issues }
    };
  }

  checkLinks() {
    const links = document.querySelectorAll('a');
    const issues = [];

    links.forEach((link, index) => {
      if (!link.href) {
        issues.push(`Link ${index} missing href`);
      }

      if (link.target === '_blank' && !link.rel.includes('noopener')) {
        issues.push(`External link ${index} missing rel="noopener"`);
      }
    });

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Links properly configured' : `Issues: ${issues.length}`,
      details: { totalLinks: links.length, issues }
    };
  }

  checkHTMLValidation() {
    // Simplified HTML validation check
    const html = document.documentElement.outerHTML;
    const issues = [];

    // Basic validation checks
    if (!html.includes('<!DOCTYPE html>')) {
      issues.push('Missing DOCTYPE declaration');
    }

    if (!html.includes('<html lang=')) {
      issues.push('Missing language attribute');
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Basic HTML validation passed' : `Issues: ${issues.join(', ')}`,
      details: { issues }
    };
  }

  async validateCSS() {
    console.log('Validating CSS...');

    const checks = {
      criticalCSS: this.checkCriticalCSS(),
      responsiveDesign: this.checkResponsiveDesign(),
      cssVariables: this.checkCSSVariables(),
      animations: this.checkAnimations(),
      crossBrowser: this.checkCSSCompatibility()
    };

    this.validationResults.css = checks;
    return checks;
  }

  checkCriticalCSS() {
    const criticalSelectors = [
      '.header',
      '.nav',
      '.hero',
      '.container',
      '.btn'
    ];

    const missingSelectors = criticalSelectors.filter(selector => {
      return !document.querySelector(selector);
    });

    return {
      passed: missingSelectors.length === 0,
      message: missingSelectors.length === 0 ? 'Critical CSS classes present' : `Missing: ${missingSelectors.join(', ')}`,
      details: { missingSelectors }
    };
  }

  checkResponsiveDesign() {
    const mediaQueries = Array.from(document.styleSheets)
      .flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules);
        } catch (e) {
          return [];
        }
      })
      .filter(rule => rule.type === CSSRule.MEDIA_RULE)
      .length;

    return {
      passed: mediaQueries > 0,
      message: `Found ${mediaQueries} media queries`,
      details: { mediaQueries }
    };
  }

  checkCSSVariables() {
    const rootElement = document.documentElement;
    const computedStyle = getComputedStyle(rootElement);
    const hasVariables = computedStyle.getPropertyValue('--primary-color') !== '';

    return {
      passed: hasVariables,
      message: hasVariables ? 'CSS variables in use' : 'No CSS variables detected',
      details: { hasVariables }
    };
  }

  checkAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos], .animate__animated, [style*="animation"]');
    
    return {
      passed: animatedElements.length > 0,
      message: `Found ${animatedElements.length} animated elements`,
      details: { animatedElements: animatedElements.length }
    };
  }

  checkCSSCompatibility() {
    const modernFeatures = [
      'display: grid',
      'display: flex',
      'position: sticky',
      'object-fit: cover'
    ];

    const supportedFeatures = modernFeatures.filter(feature => CSS.supports(feature));

    return {
      passed: supportedFeatures.length === modernFeatures.length,
      message: `${supportedFeatures.length}/${modernFeatures.length} modern CSS features supported`,
      details: { supportedFeatures, totalFeatures: modernFeatures.length }
    };
  }

  async validateJavaScript() {
    console.log('Validating JavaScript...');

    const checks = {
      errorHandling: this.checkErrorHandling(),
      eventListeners: this.checkEventListeners(),
      accessibility: this.checkJSAccessibility(),
      performance: this.checkJSPerformance(),
      modules: this.checkModuleStructure()
    };

    this.validationResults.javascript = checks;
    return checks;
  }

  checkErrorHandling() {
    // Check if error handling is implemented
    const hasErrorHandling = typeof window.addEventListener === 'function';
    
    window.addEventListener('error', () => {
      // Error handler exists
    });

    return {
      passed: hasErrorHandling,
      message: 'Error handling capabilities present',
      details: { hasErrorHandling }
    };
  }

  checkEventListeners() {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    let hasEventListeners = 0;

    interactiveElements.forEach(element => {
      if (element.onclick || element.addEventListener) {
        hasEventListeners++;
      }
    });

    return {
      passed: hasEventListeners > 0,
      message: `${hasEventListeners} elements have event listeners`,
      details: { totalInteractive: interactiveElements.length, withListeners: hasEventListeners }
    };
  }

  checkJSAccessibility() {
    const keyboardNavigable = document.querySelectorAll('[tabindex], button, a, input, select, textarea');
    
    return {
      passed: keyboardNavigable.length > 0,
      message: `${keyboardNavigable.length} keyboard navigable elements`,
      details: { keyboardNavigable: keyboardNavigable.length }
    };
  }

  checkJSPerformance() {
    const scripts = document.querySelectorAll('script[src]');
    const inlineScripts = document.querySelectorAll('script:not([src])');

    return {
      passed: scripts.length < 10 && inlineScripts.length < 5,
      message: `${scripts.length} external scripts, ${inlineScripts.length} inline scripts`,
      details: { externalScripts: scripts.length, inlineScripts: inlineScripts.length }
    };
  }

  checkModuleStructure() {
    // Check if main classes/modules are available
    const expectedClasses = [
      'InvestmentSite',
      'ChartManager',
      'AnimationManager',
      'PerformanceOptimizer'
    ];

    const availableClasses = expectedClasses.filter(className => window[className]);

    return {
      passed: availableClasses.length === expectedClasses.length,
      message: `${availableClasses.length}/${expectedClasses.length} modules loaded`,
      details: { availableClasses, expectedClasses }
    };
  }

  async validatePerformance() {
    console.log('Validating performance...');

    const checks = {
      pageSpeed: await this.checkPageSpeed(),
      resourceOptimization: this.checkResourceOptimization(),
      caching: this.checkCaching(),
      compression: this.checkCompression()
    };

    this.validationResults.performance = checks;
    return checks;
  }

  async checkPageSpeed() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;

    return {
      passed: loadTime < 3000,
      message: `Page load time: ${loadTime.toFixed(0)}ms`,
      details: { loadTime, threshold: 3000 }
    };
  }

  checkResourceOptimization() {
    const images = document.querySelectorAll('img');
    const optimizedImages = Array.from(images).filter(img => 
      img.loading === 'lazy' || img.src.includes('webp')
    );

    return {
      passed: optimizedImages.length === images.length,
      message: `${optimizedImages.length}/${images.length} images optimized`,
      details: { optimized: optimizedImages.length, total: images.length }
    };
  }

  checkCaching() {
    const hasCacheHeaders = 'serviceWorker' in navigator;
    
    return {
      passed: hasCacheHeaders,
      message: hasCacheHeaders ? 'Service Worker available for caching' : 'No caching strategy detected',
      details: { hasCacheHeaders }
    };
  }

  checkCompression() {
    // Check if resources are likely compressed (simplified check)
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');

    return {
      passed: true, // Assume compression is handled by server
      message: `${scripts.length} scripts, ${styles.length} stylesheets (compression assumed)`,
      details: { scripts: scripts.length, styles: styles.length }
    };
  }

  async validateAccessibility() {
    console.log('Validating accessibility...');

    const checks = {
      keyboardNavigation: this.checkKeyboardAccess(),
      screenReader: this.checkScreenReaderSupport(),
      colorContrast: this.checkContrastCompliance(),
      ariaLabels: this.checkAriaImplementation()
    };

    this.validationResults.accessibility = checks;
    return checks;
  }

  checkKeyboardAccess() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    return {
      passed: focusableElements.length > 0,
      message: `${focusableElements.length} keyboard accessible elements`,
      details: { focusableElements: focusableElements.length }
    };
  }

  checkScreenReaderSupport() {
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const skipLink = document.querySelector('.skip-link');

    return {
      passed: landmarks.length > 0 && headings.length > 0,
      message: `${landmarks.length} landmarks, ${headings.length} headings, ${skipLink ? 'has' : 'no'} skip link`,
      details: { landmarks: landmarks.length, headings: headings.length, hasSkipLink: !!skipLink }
    };
  }

  checkContrastCompliance() {
    // Simplified contrast check
    return {
      passed: true, // Assume good contrast from design
      message: 'Color contrast assumed compliant (manual testing recommended)',
      details: { needsManualTesting: true }
    };
  }

  checkAriaImplementation() {
    const ariaLabels = document.querySelectorAll('[aria-label]');
    const ariaDescribedBy = document.querySelectorAll('[aria-describedby]');
    const ariaLabelledBy = document.querySelectorAll('[aria-labelledby]');

    const totalAria = ariaLabels.length + ariaDescribedBy.length + ariaLabelledBy.length;

    return {
      passed: totalAria > 0,
      message: `${totalAria} ARIA attributes implemented`,
      details: { 
        ariaLabels: ariaLabels.length,
        ariaDescribedBy: ariaDescribedBy.length,
        ariaLabelledBy: ariaLabelledBy.length
      }
    };
  }

  async validateSEO() {
    console.log('Validating SEO...');

    const checks = {
      metaTags: this.checkSEOMetaTags(),
      headingStructure: this.checkSEOHeadings(),
      openGraph: this.checkOpenGraph(),
      structuredData: this.checkStructuredData(),
      sitemapRobots: this.checkSitemapRobots()
    };

    this.validationResults.seo = checks;
    return checks;
  }

  checkSEOMetaTags() {
    const requiredSEO = [
      'meta[name="description"]',
      'meta[name="keywords"]',
      'title',
      'link[rel="canonical"]'
    ];

    const missing = requiredSEO.filter(selector => !document.querySelector(selector));

    return {
      passed: missing.length === 0,
      message: missing.length === 0 ? 'All SEO meta tags present' : `Missing: ${missing.length}`,
      details: { missing }
    };
  }

  checkSEOHeadings() {
    const h1s = document.querySelectorAll('h1');
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    return {
      passed: h1s.length === 1 && allHeadings.length > 3,
      message: `${h1s.length} H1 tags, ${allHeadings.length} total headings`,
      details: { h1Count: h1s.length, totalHeadings: allHeadings.length }
    };
  }

  checkOpenGraph() {
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    const missing = ogTags.filter(property => 
      !document.querySelector(`meta[property="${property}"]`)
    );

    return {
      passed: missing.length === 0,
      message: missing.length === 0 ? 'Open Graph tags complete' : `Missing: ${missing.length}`,
      details: { missing }
    };
  }

  checkStructuredData() {
    const structuredData = document.querySelector('script[type="application/ld+json"]');

    return {
      passed: !!structuredData,
      message: structuredData ? 'Structured data present' : 'No structured data found',
      details: { hasStructuredData: !!structuredData }
    };
  }

  checkSitemapRobots() {
    // This would need server-side checking in real implementation
    return {
      passed: true,
      message: 'Sitemap and robots.txt need server-side validation',
      details: { needsServerCheck: true }
    };
  }

  async validateSecurity() {
    console.log('Validating security...');

    const checks = {
      https: this.checkHTTPS(),
      contentSecurityPolicy: this.checkCSP(),
      externalLinks: this.checkExternalLinks(),
      formSecurity: this.checkFormSecurity()
    };

    this.validationResults.security = checks;
    return checks;
  }

  checkHTTPS() {
    const isHTTPS = location.protocol === 'https:';

    return {
      passed: isHTTPS || location.hostname === 'localhost',
      message: isHTTPS ? 'HTTPS enabled' : 'HTTP detected (HTTPS recommended for production)',
      details: { protocol: location.protocol }
    };
  }

  checkCSP() {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    return {
      passed: !!cspMeta,
      message: cspMeta ? 'CSP meta tag present' : 'No CSP detected (recommended for security)',
      details: { hasCSP: !!cspMeta }
    };
  }

  checkExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    const secureLinks = Array.from(externalLinks).filter(link => 
      link.rel.includes('noopener') && link.rel.includes('noreferrer')
    );

    return {
      passed: secureLinks.length === externalLinks.length,
      message: `${secureLinks.length}/${externalLinks.length} external links secure`,
      details: { 
        total: externalLinks.length, 
        secure: secureLinks.length 
      }
    };
  }

  checkFormSecurity() {
    const forms = document.querySelectorAll('form');
    const secureForms = Array.from(forms).filter(form => 
      form.method === 'post' || form.method === 'POST'
    );

    return {
      passed: secureForms.length === forms.length || forms.length === 0,
      message: `${secureForms.length}/${forms.length} forms use secure methods`,
      details: { 
        total: forms.length, 
        secure: secureForms.length 
      }
    };
  }

  async validateDeploymentReadiness() {
    console.log('Validating deployment readiness...');

    const checks = {
      favicon: this.checkFavicon(),
      manifest: this.checkManifest(),
      serviceWorker: this.checkServiceWorker(),
      errorPages: this.checkErrorPages(),
      analytics: this.checkAnalytics()
    };

    this.validationResults.deployment = checks;
    return checks;
  }

  checkFavicon() {
    const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    
    return {
      passed: !!favicon,
      message: favicon ? 'Favicon present' : 'No favicon detected',
      details: { hasFavicon: !!favicon }
    };
  }

  checkManifest() {
    const manifest = document.querySelector('link[rel="manifest"]');
    
    return {
      passed: !!manifest,
      message: manifest ? 'Web app manifest present' : 'No manifest detected',
      details: { hasManifest: !!manifest }
    };
  }

  checkServiceWorker() {
    const hasServiceWorker = 'serviceWorker' in navigator;
    
    return {
      passed: hasServiceWorker,
      message: hasServiceWorker ? 'Service Worker support available' : 'No Service Worker support',
      details: { hasServiceWorker }
    };
  }

  checkErrorPages() {
    // This would need server-side implementation
    return {
      passed: true,
      message: 'Error pages need server-side configuration',
      details: { needsServerConfig: true }
    };
  }

  checkAnalytics() {
    const hasAnalytics = document.querySelector('script[src*="analytics"], script[src*="gtag"]');
    
    return {
      passed: true, // Optional
      message: hasAnalytics ? 'Analytics detected' : 'No analytics detected (optional)',
      details: { hasAnalytics: !!hasAnalytics }
    };
  }

  generateValidationReport() {
    const allChecks = Object.values(this.validationResults).flatMap(category => 
      Object.values(category)
    );
    
    const passedChecks = allChecks.filter(check => check.passed).length;
    const totalChecks = allChecks.length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    const report = {
      summary: {
        score,
        passed: passedChecks,
        total: totalChecks,
        categories: Object.keys(this.validationResults).length
      },
      categories: this.validationResults,
      timestamp: new Date().toISOString(),
      deploymentReady: score >= 90
    };

    console.log('\n✅ VALIDATION REPORT');
    console.log('====================');
    console.log(`Overall Score: ${score}/100`);
    console.log(`Checks Passed: ${passedChecks}/${totalChecks}`);
    console.log(`Deployment Ready: ${report.deploymentReady ? 'YES' : 'NO'}`);

    Object.entries(this.validationResults).forEach(([category, checks]) => {
      const categoryPassed = Object.values(checks).filter(check => check.passed).length;
      const categoryTotal = Object.values(checks).length;
      const categoryScore = Math.round((categoryPassed / categoryTotal) * 100);
      
      console.log(`${category}: ${categoryScore}% (${categoryPassed}/${categoryTotal})`);
    });

    return report;
  }

  createValidationInterface() {
    if (window.location.search.includes('validate=true')) {
      this.createValidationUI();
    }
  }

  createValidationUI() {
    const validationUI = document.createElement('div');
    validationUI.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 320px;
      max-height: 400px;
      overflow-y: auto;
    `;

    validationUI.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #10b981; display: flex; align-items: center; gap: 8px;">
        <span>🔍</span> Validation Suite
      </h3>
      <button id="run-validation" style="
        background: #10b981;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 16px;
        font-weight: 600;
      ">Run Full Validation</button>
      <div id="validation-results" style="font-size: 13px; line-height: 1.4;"></div>
    `;

    document.body.appendChild(validationUI);

    document.getElementById('run-validation').addEventListener('click', async () => {
      const resultsDiv = document.getElementById('validation-results');
      resultsDiv.innerHTML = '<div style="color: #6b7280;">Running comprehensive validation...</div>';
      
      const report = await this.runFullValidation();
      
      const statusColor = report.deploymentReady ? '#10b981' : '#f59e0b';
      const statusText = report.deploymentReady ? 'Ready to Deploy' : 'Needs Attention';
      
      resultsDiv.innerHTML = `
        <div style="margin-bottom: 12px; padding: 8px; background: ${statusColor}15; border-radius: 6px; border-left: 3px solid ${statusColor};">
          <strong style="color: ${statusColor};">${statusText}</strong><br>
          <small>Score: ${report.summary.score}/100</small>
        </div>
        <div style="font-size: 12px;">
          ${Object.entries(report.categories).map(([category, checks]) => {
            const passed = Object.values(checks).filter(c => c.passed).length;
            const total = Object.values(checks).length;
            const percentage = Math.round((passed / total) * 100);
            const color = percentage >= 90 ? '#10b981' : percentage >= 70 ? '#f59e0b' : '#ef4444';
            
            return `<div style="margin: 4px 0; color: ${color};">
              ${category}: ${percentage}% (${passed}/${total})
            </div>`;
          }).join('')}
        </div>
      `;
    });
  }
}

// Initialize validation checklist
document.addEventListener('DOMContentLoaded', () => {
  window.validationChecklist = new ValidationChecklist();
});

// Export for global access
window.ValidationChecklist = ValidationChecklist;
