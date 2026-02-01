"use client";

import { useEffect, useState, startTransition } from "react";
import { ClientCache } from "@/lib/client-cache";

type Fetcher<T> = () => Promise<T>;

export function useCachedData<T>(key: string, fetcher: Fetcher<T>, ttl = 10 * 60 * 1000) {
  const [data, setData] = useState<T | null>(() => {
    // Initial sync read (or null on hydration mismatch, but localstorage is accessible in effect usually)
    // To match server HTML, we start null, then sync in effect.
    // OR we accept layout shift if we want instant data.
    // For Instant Navigation, we want data immediately if client-side nav.
    // We can't read LS during SSR hydration.
    return null;
  });
  
  const [isServingCache, setIsServingCache] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // 1. Load from cache immediately on mount
    const cached = ClientCache.get<T>(key);
    if (cached) {
      setData(cached);
      setIsServingCache(true);
    }

    // 2. Build revalidation logic
    const revalidate = async () => {
      const isStale = ClientCache.isStale(key, ttl);
      if (!cached || isStale) {
        setIsValidating(true);
        try {
          const fresh = await fetcher();
          ClientCache.set(key, fresh);
          startTransition(() => {
             setData(fresh);
             setIsServingCache(false);
          });
        } catch (e) {
          console.error("Background fetch failed", e);
        } finally {
          setIsValidating(false);
        }
      }
    };

    revalidate();
  }, [key, ttl]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isServingCache, isValidating };
}
