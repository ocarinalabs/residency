"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { VisitorTable, type VisitorData } from "@/components/visitor-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Visitor } from "@/lib/nuveq-scraper";

export default function Page() {
  const [todayVisitors, setTodayVisitors] = useState<Visitor[]>([]);
  const [futureVisitors, setFutureVisitors] = useState<Visitor[]>([]);
  const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    // Fetch visitor data from Nuveq
    const fetchVisitors = async () => {
      try {
        setIsLoading(true);

        // Fetch all visitor types in parallel
        const [todayRes, futureRes, pendingRes] = await Promise.all([
          fetch("/api/nuveq/visitors/today"),
          fetch("/api/nuveq/visitors/future"),
          fetch("/api/nuveq/visitors/pending"),
        ]);

        const [todayData, futureData, pendingData] = await Promise.all([
          todayRes.json(),
          futureRes.json(),
          pendingRes.json(),
        ]);

        if (todayData.success) {
          setTodayVisitors(todayData.visitors);

          // Data is already in the correct format from the API
        }

        if (futureData.success) {
          setFutureVisitors(futureData.visitors);
        }

        if (pendingData.success) {
          setPendingVisitors(pendingData.visitors);
        }

        // Check for any errors
        const errors = [];
        if (!todayData.success) errors.push("Today: " + todayData.message);
        if (!futureData.success) errors.push("Future: " + futureData.message);
        if (!pendingData.success)
          errors.push("Pending: " + pendingData.message);

        if (errors.length > 0) {
          setError(errors.join(", "));
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching visitors:", err);
        setError("Failed to connect to Nuveq");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitors();

    // Refresh every 60 seconds
    const interval = setInterval(fetchVisitors, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
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
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold">Dashboard</h2>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                    {error}
                  </div>
                )}
                {!error &&
                  (todayVisitors.length > 0 ||
                    futureVisitors.length > 0 ||
                    pendingVisitors.length > 0) && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                      Connected to Nuveq - {todayVisitors.length} today,{" "}
                      {futureVisitors.length} future, {pendingVisitors.length}{" "}
                      pending
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
  );
}
