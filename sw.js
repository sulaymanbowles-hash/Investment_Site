/*
==========================================================================
SERVICE WORKER - PROGRESSIVE WEB APP
==========================================================================
Caching strategy and offline functionality for investment site
==========================================================================
*/

const CACHE_NAME = 'investment-site-v1.0.0';
const STATIC_CACHE = 'static-cache-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-cache-v1.0.0';

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/js/main.js',
  '/assets/js/charts.js',
  '/assets/js/animations.js',
  '/assets/js/placeholders.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Cache size limits
const CACHE_SIZE_LIMIT = 50;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Cache installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin && !STATIC_ASSETS.includes(request.url)) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Only cache successful responses
            if (networkResponse.status === 200) {
              return cacheResponse(request, networkResponse.clone())
                .then(() => networkResponse);
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return fallback for other requests
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Cache response with size management
function cacheResponse(request, response) {
  const url = new URL(request.url);
  
  // Don't cache certain requests
  if (
    request.method !== 'GET' ||
    url.pathname.includes('/api/') ||
    response.status !== 200 ||
    response.type === 'opaque'
  ) {
    return Promise.resolve();
  }
  
  return caches.open(DYNAMIC_CACHE)
    .then(cache => {
      return cache.put(request, response)
        .then(() => limitCacheSize(DYNAMIC_CACHE, CACHE_SIZE_LIMIT));
    })
    .catch(error => {
      console.error('Service Worker: Failed to cache response', error);
    });
}

// Limit cache size
function limitCacheSize(cacheName, sizeLimit) {
  return caches.open(cacheName)
    .then(cache => {
      return cache.keys()
        .then(keys => {
          if (keys.length > sizeLimit) {
            console.log(`Service Worker: Cache size limit exceeded, cleaning up ${cacheName}`);
            return cache.delete(keys[0])
              .then(() => limitCacheSize(cacheName, sizeLimit));
          }
        });
    });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'newsletter-signup') {
    event.waitUntil(syncNewsletterSignups());
  }
});

// Sync newsletter signups when back online
function syncNewsletterSignups() {
  return new Promise((resolve, reject) => {
    // Get stored signups from IndexedDB
    const request = indexedDB.open('investment-site-db', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['newsletter'], 'readonly');
      const store = transaction.objectStore('newsletter');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const signups = getAllRequest.result;
        
        Promise.all(
          signups.map(signup => 
            fetch('/api/newsletter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(signup)
            }).then(() => {
              // Remove from local storage after successful sync
              const deleteTransaction = db.transaction(['newsletter'], 'readwrite');
              const deleteStore = deleteTransaction.objectStore('newsletter');
              return deleteStore.delete(signup.id);
            })
          )
        ).then(() => {
          console.log('Service Worker: Newsletter signups synced');
          resolve();
        }).catch(reject);
      };
    };
    
    request.onerror = reject;
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received');
  
  let notificationData = {};
  
  if (event.data) {
    notificationData = event.data.json();
  }
  
  const options = {
    title: notificationData.title || 'Investment Update',
    body: notificationData.body || 'New market insights available',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/badge-72x72.png',
    image: notificationData.image,
    data: notificationData.data,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/assets/images/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/images/dismiss-icon.png'
      }
    ],
    requireInteraction: true,
    tag: 'investment-update'
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to specific page
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync', event.tag);
  
  if (event.tag === 'market-data-sync') {
    event.waitUntil(syncMarketData());
  }
});

// Sync market data in background
function syncMarketData() {
  return fetch('/api/market-data')
    .then(response => response.json())
    .then(data => {
      // Cache fresh market data
      return caches.open(DYNAMIC_CACHE)
        .then(cache => {
          return cache.put('/api/market-data', new Response(JSON.stringify(data)));
        });
    })
    .catch(error => {
      console.error('Service Worker: Failed to sync market data', error);
    });
}

// Handle skip waiting message from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
