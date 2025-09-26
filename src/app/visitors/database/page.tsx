"use client";

import { useState, useMemo } from "react";
import { VisitorTable, type VisitorData } from "@/components/visitor-table";
import { useVisitorData } from "@/hooks/use-visitor-data";
import { Loader2, RefreshCw, Clock, Database, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VisitorDatabasePage() {
  const {
    visitors,
    isLoading,
    isSyncing,
    error,
    lastSyncFormatted,
    syncFromNuveq,
  } = useVisitorData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Filter visitors based on search and type
  const filteredVisitors = useMemo(() => {
    let filtered = visitors.database;

    // Apply type filter
    if (filterType === "today") {
      filtered = visitors.today;
    } else if (filterType === "future") {
      filtered = visitors.future;
    } else if (filterType === "pending") {
      filtered = visitors.pending;
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (visitor) =>
          visitor.name?.toLowerCase().includes(search) ||
          visitor.company?.toLowerCase().includes(search) ||
          visitor.credential?.toLowerCase().includes(search) ||
          visitor.reasonForVisit?.toLowerCase().includes(search) ||
          visitor.invitedBy?.toLowerCase().includes(search) ||
          visitor.approvedBy?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [visitors, searchTerm, filterType]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Visitor Database</h1>
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, company, credential, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visitors</SelectItem>
              <SelectItem value="today">Today Only</SelectItem>
              <SelectItem value="future">Future Only</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        {searchTerm || filterType !== "all" ? (
          <div className="text-sm text-gray-500 mb-4">
            Showing {filteredVisitors.length} of {visitors.database.length}{" "}
            visitors
          </div>
        ) : null}
      </div>

      {/* Table */}
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredVisitors.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-12 w-12 text-gray-300" />
              <p className="text-gray-500">
                {searchTerm || filterType !== "all"
                  ? "No visitors found matching your criteria"
                  : "No visitors in database"}
              </p>
            </div>
          </Card>
        ) : (
          <VisitorTable
            data={filteredVisitors.map(
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
