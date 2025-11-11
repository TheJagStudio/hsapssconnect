// Cache configuration
const CACHE_VERSION = 'v1';
const CACHE_NAME = `hsapss-cache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `hsapss-runtime-${CACHE_VERSION}`;

// Files to cache on install
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/static/images/manifest-icon-512.maskable.png'
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', function(event) {
    const { request } = event;
    const url = new URL(request.url);

    // Check if the request is for cacheable resources
    const isCacheable = 
        request.method === 'GET' && (
            request.url.endsWith('.json') ||
            request.url.endsWith('.html') ||
            request.url.endsWith('.mp3') ||
            request.url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)
        );

    if (isCacheable) {
        // Network-first strategy with cache fallback
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Clone the response before caching
                    const responseToCache = response.clone();
                    
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(request, responseToCache);
                    });
                    
                    return response;
                })
                .catch(() => {
                    // If network fails, try to serve from cache
                    return caches.match(request).then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Return a fallback response if nothing in cache
                        return new Response('Offline - Resource not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
                })
        );
    } else {
        // For non-cacheable requests, just try to fetch
        event.respondWith(fetch(request));
    }
});

self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.content,
            icon: '/static/images/manifest-icon-512.maskable.png',
            badge: '/static/images/manifest-icon-512.maskable.png',
            data: data
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
