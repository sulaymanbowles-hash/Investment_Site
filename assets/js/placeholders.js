/* 
==========================================================================
PLACEHOLDER IMAGES CREATOR
==========================================================================
Creates placeholder images for development using CSS gradients
*/

// Create placeholder images as data URLs for development
const placeholderImages = {
  'research-tech.jpg': 'data:image/svg+xml;base64,' + btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad1)"/>
      <text x="200" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">AI Technology</text>
      <text x="200" y="170" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Investment Research</text>
    </svg>
  `),
  
  'research-energy.jpg': 'data:image/svg+xml;base64,' + btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad2)"/>
      <text x="200" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Green Energy</text>
      <text x="200" y="170" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Sustainable Future</text>
    </svg>
  `),
  
  'research-healthcare.jpg': 'data:image/svg+xml;base64,' + btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad3)"/>
      <text x="200" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Healthcare</text>
      <text x="200" y="170" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Biotech Innovation</text>
    </svg>
  `)
};

// Replace image sources with placeholders on load
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[src*="/assets/images/"]');
  
  images.forEach(img => {
    const filename = img.src.split('/').pop();
    if (placeholderImages[filename]) {
      img.src = placeholderImages[filename];
    }
  });
});
