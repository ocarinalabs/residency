"use client";

import { VisitorTable, type VisitorData } from "@/components/visitor-table";
import { useVisitorData } from "@/hooks/use-visitor-data";
import { Loader2, RefreshCw, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TodayVisitorsPage() {
  const {
    visitors,
    isLoading,
    isSyncing,
    error,
    lastSyncFormatted,
    syncFromNuveq,
  } = useVisitorData();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Today's Visitors</h1>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <div className="flex items-center gap-4">
            {lastSyncFormatted && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last sync: {lastSyncFormatted}</span>
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

        {/* Status */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <VisitorTable
            data={visitors.today.map(
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
        )}
      </div>
    </div>
  );
}
