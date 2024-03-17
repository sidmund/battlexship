// TODO cache file assets separately

/** Load from network first, then fallback to cache in case of network error.
 *  This ensures the cache has the most up-to-date content whenever the client is online. */
async function networkThenCache(request) {
    let cache;
    try {
        cache = await caches.open(import.meta.env.VITE_APP_CACHE_NAME);
    } catch (cacheError) {
        // Fallback to normal fetch in case of storage issues
        return await fetch(request);
    }

    try {
        const networkResponse = await fetch(request);
        // Cache stores key,value pair of request,response
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (networkError) {
        return await cache.match(request); // return the stored response for this request
    }
}

self.addEventListener('fetch', async (event) => {
    if (event.request.url.startsWith('chrome-extension') || event.request.method === 'POST') {
        return;
    }

    // Prevent default fetch handling, and pass custom response based on caching strategy
    event.respondWith(networkThenCache(event.request));
});
