"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type DashboardUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  agentArea?: string | null;
};

type DashboardContextType = {
  user: DashboardUser | null;
  isLoading: boolean;
  role: string | undefined;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const CACHE_KEY = "dashboard_cache_v1";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load from LocalStorage on Mount
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        if (now - parsed.timestamp < CACHE_TTL) {
          console.log("⚡ Loaded dashboard from cache");
          setUser(parsed.user);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to parse dashboard cache", e);
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }, []);

  // 2. Sync with Session (Background Revalidation)
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const freshUser = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        agentArea: session.user.agentArea,
      };

      // Only update if different to avoid re-renders
      if (JSON.stringify(freshUser) !== JSON.stringify(user)) {
        console.log("🔄 Updating dashboard cache from network");
        setUser(freshUser);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          user: freshUser,
          timestamp: Date.now()
        }));
        setIsLoading(false);
      }
    } else if (status === "unauthenticated") {
       setUser(null);
       localStorage.removeItem(CACHE_KEY);
       setIsLoading(false);
    }
  }, [session, status, user]);

  return (
    <DashboardContext.Provider value={{ user, role: user?.role, isLoading }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
