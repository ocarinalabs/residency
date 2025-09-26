import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Visitor } from "@/lib/nuveq/scraper";

interface VisitorData {
  today: Visitor[];
  future: Visitor[];
  pending: Visitor[];
  database: Visitor[];
}

interface UseVisitorDataReturn {
  visitors: VisitorData;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSync: string | null;
  lastSyncFormatted: string | null;
  loadLocalData: () => Promise<void>;
  syncFromNuveq: () => Promise<void>;
}

export function useVisitorData(): UseVisitorDataReturn {
  const [todayVisitors, setTodayVisitors] = useState<Visitor[]>([]);
  const [futureVisitors, setFutureVisitors] = useState<Visitor[]>([]);
  const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Load data from local cache
  const loadLocalData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/visitors/local");
      const result = await response.json();

      if (result.success && result.data) {
        setTodayVisitors(result.data.today.visitors || []);
        setFutureVisitors(result.data.future.visitors || []);
        setPendingVisitors(result.data.pending.visitors || []);
        setLastSync(result.data.lastSync);
        setError(null);
      }
    } catch (err) {
      console.error("Error loading local data:", err);
      setError("Failed to load local data");
    } finally {
      setIsLoading(false);
    }
  };

  // Manual sync from Nuveq
  const syncFromNuveq = async () => {
    try {
      setIsSyncing(true);
      setError(null);

      const response = await fetch("/api/visitors/sync", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        // Reload the local data after successful sync
        await loadLocalData();
      } else {
        setError(result.message || "Sync failed");
      }
    } catch (err) {
      console.error("Error syncing from Nuveq:", err);
      setError("Failed to sync from Nuveq");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Load data from local cache on mount
    loadLocalData();
  }, []);

  // Combine all visitors for database view
  const databaseVisitors = [
    ...todayVisitors,
    ...futureVisitors,
    ...pendingVisitors,
  ];

  const lastSyncFormatted = lastSync
    ? formatDistanceToNow(new Date(lastSync), { addSuffix: true })
    : null;

  return {
    visitors: {
      today: todayVisitors,
      future: futureVisitors,
      pending: pendingVisitors,
      database: databaseVisitors,
    },
    isLoading,
    isSyncing,
    error,
    lastSync,
    lastSyncFormatted,
    loadLocalData,
    syncFromNuveq,
  };
}
