/*
==========================================================================
LOCAL DEVELOPMENT SERVER
==========================================================================
Simple Node.js server for local development and testing
==========================================================================
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'text/plain';
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>404 - Not Found</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #dc2626; }
              </style>
            </head>
            <body>
              <h1>404 - File Not Found</h1>
              <p>The requested file <code>${filePath}</code> was not found.</p>
              <a href="/">← Back to Home</a>
            </body>
          </html>
        `);
      } else {
        // Server error
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>500 - Server Error</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #dc2626; }
              </style>
            </head>
            <body>
              <h1>500 - Internal Server Error</h1>
              <p>An error occurred while serving the file.</p>
              <a href="/">← Back to Home</a>
            </body>
          </html>
        `);
      }
      return;
    }

    const contentType = getContentType(filePath);
    
    // Set appropriate headers
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Add security headers
    if (contentType === 'text/html') {
      headers['X-Content-Type-Options'] = 'nosniff';
      headers['X-Frame-Options'] = 'DENY';
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    res.writeHead(200, headers);
    res.end(data);
  });
}

function handleAPIRequest(req, res, pathname) {
  // Mock API endpoints for development
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  switch (pathname) {
    case '/api/market-data':
      res.end(JSON.stringify({
        sp500: { price: 4567.89, change: 1.24 },
        nasdaq: { price: 14789.33, change: 2.15 },
        dow: { price: 35678.90, change: -0.58 },
        bitcoin: { price: 42567, change: 3.45 },
        timestamp: Date.now()
      }));
      break;

    case '/api/newsletter':
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
          console.log('Newsletter signup:', JSON.parse(body));
          res.end(JSON.stringify({ success: true, message: 'Subscription successful!' }));
        });
      } else {
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;

    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle API requests
  if (pathname.startsWith('/api/')) {
    return handleAPIRequest(req, res, pathname);
  }

  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Serve static files
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Remove leading slash and resolve file path
  const filePath = path.join(__dirname, pathname.slice(1));

  // Security check - prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>403 - Forbidden</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1>403 - Forbidden</h1>
          <p>Access to this path is not allowed.</p>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
    return;
  }

  // Check if file exists
  fs.stat(normalizedPath, (err, stats) => {
    if (err) {
      serveFile(res, normalizedPath);
      return;
    }

    if (stats.isDirectory()) {
      // Try to serve index.html from directory
      const indexPath = path.join(normalizedPath, 'index.html');
      serveFile(res, indexPath);
    } else {
      serveFile(res, normalizedPath);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log('\n🚀 Investment Site Development Server');
  console.log('=====================================');
  console.log(`🌐 Server running at: http://${HOST}:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('\n📊 Available pages:');
  console.log(`   • Home: http://${HOST}:${PORT}/`);
  console.log(`   • Market Data API: http://${HOST}:${PORT}/api/market-data`);
  console.log('\n💡 Press Ctrl+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down development server...');
  server.close(() => {
    console.log('✅ Server stopped successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down development server...');
  server.close(() => {
    console.log('✅ Server stopped successfully');
    process.exit(0);
  });
});
