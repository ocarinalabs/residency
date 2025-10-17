"use client";

import { Authenticated } from "convex/react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { VisitorTable, type VisitorData } from "@/components/visitor-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

import type { Visitor } from "@/lib/nuveq/scraper";

export default function Page() {
  const [todayVisitors, setTodayVisitors] = useState<Visitor[]>([]);
  const [futureVisitors, setFutureVisitors] = useState<Visitor[]>([]);
  const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("today");
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

  return (
    <Authenticated>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Visitor count and status */}
                <div className="px-4 lg:px-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">Dashboard</h2>
                      {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {lastSync && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            Last sync:{" "}
                            {formatDistanceToNow(new Date(lastSync), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      )}
                      <Button
                        onClick={syncFromNuveq}
                        disabled={isSyncing}
                        variant="outline"
                        size="sm"
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh from Nuveq
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                      {error}
                    </div>
                  )}
                </div>

                <SectionCards
                  todayVisitors={todayVisitors.length}
                  pendingApprovals={pendingVisitors.length}
                  futureVisitors={futureVisitors.length}
                  roomsOccupied={0}
                />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>

                {/* Tabs for different visitor views */}
                <div className="px-4 lg:px-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="today">
                        Today ({todayVisitors.length})
                      </TabsTrigger>
                      <TabsTrigger value="pending">
                        Pending ({pendingVisitors.length})
                      </TabsTrigger>
                      <TabsTrigger value="future">
                        Future ({futureVisitors.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="today">
                      <VisitorTable
                        data={todayVisitors.map(
                          (visitor, index) =>
                            ({
                              id: index + 1,
                              name: visitor.name,
                              company: visitor.company,
                              visitFrom: visitor.visitFrom,
                              visitTill: visitor.visitTill,
                              invitedBy: visitor.invitedBy,
                              site: visitor.site,
                              visitorType: visitor.visitorType,
                              credential: visitor.credential,
                              vehicleNumber: visitor.vehicleNumber,
                              reasonForVisit: visitor.reasonForVisit,
                              approvedBy: visitor.approvedBy,
                            }) as VisitorData
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="pending">
                      <VisitorTable
                        data={pendingVisitors.map(
                          (visitor, index) =>
                            ({
                              id: index + 1,
                              name: visitor.name,
                              company: visitor.company,
                              visitFrom: visitor.visitFrom,
                              visitTill: visitor.visitTill,
                              invitedBy: visitor.invitedBy,
                              site: visitor.site,
                              visitorType: visitor.visitorType,
                              credential: visitor.credential,
                              vehicleNumber: visitor.vehicleNumber,
                              reasonForVisit: visitor.reasonForVisit,
                              approvedBy: visitor.approvedBy,
                            }) as VisitorData
                        )}
                        showPending={true}
                      />
                    </TabsContent>

                    <TabsContent value="future">
                      <VisitorTable
                        data={futureVisitors.map(
                          (visitor, index) =>
                            ({
                              id: index + 1,
                              name: visitor.name,
                              company: visitor.company,
                              visitFrom: visitor.visitFrom,
                              visitTill: visitor.visitTill,
                              invitedBy: visitor.invitedBy,
                              site: visitor.site,
                              visitorType: visitor.visitorType,
                              credential: visitor.credential,
                              vehicleNumber: visitor.vehicleNumber,
                              reasonForVisit: visitor.reasonForVisit,
                              approvedBy: visitor.approvedBy,
                            }) as VisitorData
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Authenticated>
  );
}
