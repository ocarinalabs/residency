"use client";

import * as React from "react";
import { IconCheck, IconDotsVertical, IconUserX, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface VisitorData {
  id: number;
  name: string;
  company: string;
  visitFrom: string;
  visitTill: string;
  invitedBy: string;
  status?: string;
  site?: string;
  visitorType?: string;
  credential?: string;
  vehicleNumber?: string;
  reasonForVisit?: string;
  approvedBy?: string;
}

function getVisitorStatus(
  visitFrom: string,
  visitTill: string
): {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
} {
  const now = new Date();
  const from = new Date(visitFrom);
  const till = new Date(visitTill);

  if (now < from) {
    return { label: "Expected", variant: "secondary" };
  } else if (now >= from && now <= till) {
    return { label: "Checked In", variant: "default" };
  } else {
    return { label: "Checked Out", variant: "outline" };
  }
}

function VisitorDetailsDialog({ visitor }: { visitor: VisitorData }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 h-auto font-medium text-foreground hover:bg-transparent"
        >
          {visitor.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{visitor.name}</DialogTitle>
          <DialogDescription>Visitor Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Company</Label>
              <p className="font-medium">{visitor.company || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Invited By</Label>
              <p className="font-medium">{visitor.invitedBy || "Reception"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Visit From</Label>
              <p className="font-medium">{visitor.visitFrom}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Visit Till</Label>
              <p className="font-medium">{visitor.visitTill}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Site</Label>
              <p className="font-medium">
                {visitor.site || "500 Social House"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Visitor Type</Label>
              <p className="font-medium">{visitor.visitorType || "Guest"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Credential</Label>
              <p className="font-medium">{visitor.credential || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Vehicle Number</Label>
              <p className="font-medium">{visitor.vehicleNumber || "N/A"}</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Reason for Visit</Label>
            <p className="font-medium">
              {visitor.reasonForVisit || "Co-working @ 500 Social House"}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Approved By</Label>
            <p className="font-medium">
              {visitor.approvedBy || "Pending Approval"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const visitorColumns: ColumnDef<VisitorData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <VisitorDetailsDialog visitor={row.original} />;
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <div>{row.original.company || "Individual"}</div>,
  },
  {
    id: "visitDuration",
    header: "Visit Duration",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{row.original.visitFrom}</div>
        <div className="text-muted-foreground">to {row.original.visitTill}</div>
      </div>
    ),
  },
  {
    accessorKey: "invitedBy",
    header: "Invited By",
    cell: ({ row }) => row.original.invitedBy || "",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

// Separate component for actions cell to avoid hooks in non-component function
function ActionCell({ row }: { row: Row<VisitorData> }) {
      const visitor = row.original;
      const status = getVisitorStatus(visitor.visitFrom, visitor.visitTill);
      const [detailsOpen, setDetailsOpen] = React.useState(false);
      const [deleteOpen, setDeleteOpen] = React.useState(false);
      const [isDeleting, setIsDeleting] = React.useState(false);

      const determineVisitorType = (visitor: VisitorData): string => {
        const now = new Date();
        const visitFrom = new Date(visitor.visitFrom);
        const visitTill = new Date(visitor.visitTill);

        if (!visitor.approvedBy) return "pending";
        if (visitFrom <= now && visitTill >= now) return "today";
        if (visitFrom > now) return "future";
        return "today";
      };

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          const response = await fetch("/api/browserless/visitors/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              credential: visitor.credential,
              visitorType: determineVisitorType(visitor),
            }),
          });

          if (response.ok) {
            toast.success("Visitor deleted successfully");
            setDeleteOpen(false);

            // Sync data from Nuveq after deletion
            try {
              await fetch("/api/visitors/sync", { method: "POST" });
            } catch (syncError) {
              console.error("Failed to sync after deletion:", syncError);
            }

            // Then reload to show updated data
            window.location.reload();
          } else {
            const error = await response.json();
            toast.error(error.message || "Failed to delete visitor");
          }
        } catch {
          toast.error("Failed to delete visitor");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <IconDotsVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {status.label === "Expected" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      toast.success(`Checked in ${visitor.name}`);
                    }}
                  >
                    <IconCheck className="mr-2 h-4 w-4" />
                    Check In
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {status.label === "Checked In" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      toast.success(`Checked out ${visitor.name}`);
                    }}
                  >
                    <IconUserX className="mr-2 h-4 w-4" />
                    Check Out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{visitor.name}</DialogTitle>
                <DialogDescription>Visitor Details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Company</Label>
                    <p className="font-medium">
                      {visitor.company || "Individual"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Invited By</Label>
                    <p className="font-medium">{visitor.invitedBy || "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Visit From</Label>
                    <p className="font-medium">{visitor.visitFrom}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Visit Till</Label>
                    <p className="font-medium">{visitor.visitTill}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Site</Label>
                    <p className="font-medium">
                      {visitor.site || "500 Social House"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Visitor Type
                    </Label>
                    <p className="font-medium">
                      {visitor.visitorType || "Guest"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Credential</Label>
                    <p className="font-medium">{visitor.credential || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Vehicle Number
                    </Label>
                    <p className="font-medium">
                      {visitor.vehicleNumber || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Reason for Visit
                  </Label>
                  <p className="font-medium">
                    {visitor.reasonForVisit || "Co-working @ 500 Social House"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Approved By</Label>
                  <p className="font-medium">
                    {visitor.approvedBy || "Pending Approval"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Visitor</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {visitor.name}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
}

// Columns specifically for pending visitors with additional fields
export const pendingVisitorColumns: ColumnDef<VisitorData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <VisitorDetailsDialog visitor={row.original} />;
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <div>{row.original.company || "Individual"}</div>,
  },
  {
    id: "visitDuration",
    header: "Visit Duration",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{row.original.visitFrom}</div>
        <div className="text-muted-foreground">to {row.original.visitTill}</div>
      </div>
    ),
  },
  {
    accessorKey: "invitedBy",
    header: "Invited By",
    cell: ({ row }) => row.original.invitedBy || "",
  },
  {
    accessorKey: "reasonForVisit",
    header: "Reason for Visit",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.original.reasonForVisit || "Not specified"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const visitor = row.original;

      const handleApprove = async () => {
        try {
          const response = await fetch("/api/nuveq/visitors/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              credential: visitor.credential,
              name: visitor.name,
            }),
          });

          if (response.ok) {
            toast.success(`Approved ${visitor.name}`);
            // Trigger refresh of visitor data
            window.location.reload();
          } else {
            toast.error("Failed to approve visitor");
          }
        } catch {
          toast.error("Error approving visitor");
        }
      };

      const handleReject = async () => {
        try {
          const response = await fetch("/api/nuveq/visitors/reject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              credential: visitor.credential,
              name: visitor.name,
            }),
          });

          if (response.ok) {
            toast.error(`Rejected ${visitor.name}`);
            // Trigger refresh of visitor data
            window.location.reload();
          } else {
            toast.error("Failed to reject visitor");
          }
        } catch {
          toast.error("Error rejecting visitor");
        }
      };

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <IconCheck className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

interface VisitorTableProps {
  data: VisitorData[];
  showPending?: boolean;
}

export function VisitorTable({ data, showPending = false }: VisitorTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Use different columns based on whether showing pending visitors
  const columns = showPending ? pendingVisitorColumns : visitorColumns;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {showPending && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    const selected = table.getFilteredSelectedRowModel().rows;
                    toast.success(`Approved ${selected.length} visitor(s)`);
                    table.toggleAllRowsSelected(false);
                  }}
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  Approve Selected
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    const selected = table.getFilteredSelectedRowModel().rows;
                    toast.error(`Rejected ${selected.length} visitor(s)`);
                    table.toggleAllRowsSelected(false);
                  }}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Reject Selected
                </Button>
              </>
            )}
          </div>
          <Input
            placeholder="Filter visitors..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No visitors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
