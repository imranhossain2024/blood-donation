
const CACHE_VERSION = "v1";
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  version: string;
};

export class ClientCache {
  private static getKey(key: string) {
    return `dash_${CACHE_VERSION}_${key}`;
  }

  static set<T>(key: string, data: T) {
    if (typeof window === "undefined") return;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (e) {
      console.warn("LocalStorage full or unavailable", e);
    }
  }

  static get<T>(key: string, ttl: number = DEFAULT_TTL): T | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(this.getKey(key));
    if (!raw) return null;

    try {
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (entry.version !== CACHE_VERSION) {
        localStorage.removeItem(this.getKey(key));
        return null;
      }
      
      const now = Date.now();
      if (now - entry.timestamp > ttl) {
        // Data is stale, but we still return it for SWR-like behavior
        // or we could return null. For this getter, let's keep it simple.
        return entry.data;
      }
      return entry.data;
    } catch (error) {
      console.error("Cache parse error", error);
      return null;
    }
  }

  static isStale(key: string, ttl: number = DEFAULT_TTL): boolean {
    if (typeof window === "undefined") return true;
    const raw = localStorage.getItem(this.getKey(key));
    if (!raw) return true;
    
    try {
      const entry = JSON.parse(raw);
      return Date.now() - entry.timestamp > ttl;
    } catch {
      return true;
    }
  }
}
