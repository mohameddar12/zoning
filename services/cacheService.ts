interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class CacheService<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private ttl: number; // Time to live in milliseconds
  
  constructor(ttlMinutes: number = 60) {
    this.ttl = ttlMinutes * 60 * 1000;
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Remove expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export default CacheService; 