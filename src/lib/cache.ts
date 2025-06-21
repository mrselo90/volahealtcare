// Simple in-memory cache for API responses
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheItem> = new Map();

  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a global cache instance
const cache = new SimpleCache();

// Clean up expired items every 10 minutes
if (typeof window === 'undefined') {
  setInterval(() => cache.cleanup(), 10 * 60 * 1000);
}

export default cache;

// Helper function to create cache-aware API responses
export function createCachedResponse(data: any, maxAge: number = 300) {
  const headers = {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    'CDN-Cache-Control': `public, s-maxage=${maxAge}`,
    'Vary': 'Accept-Encoding',
  };
  
  return { data, headers };
} 