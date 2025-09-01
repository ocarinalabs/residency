import {
  IconUsers,
  IconClock,
  IconHome,
  IconUserCheck,
} from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  todayVisitors?: number;
  pendingApprovals?: number;
  futureVisitors?: number;
  roomsOccupied?: number;
}

export function SectionCards({
  todayVisitors = 0,
  pendingApprovals = 0,
  futureVisitors = 0,
  roomsOccupied = 0,
}: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Visitors Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {todayVisitors}
          </CardTitle>
          <CardAction>
            <IconUsers className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Currently in building
          </div>
          <div className="text-muted-foreground">Active visitor passes</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Approvals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingApprovals}
          </CardTitle>
          <CardAction>
            <IconUserCheck className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pendingApprovals > 0 ? "Awaiting approval" : "All clear"}
          </div>
          <div className="text-muted-foreground">
            {pendingApprovals > 0 ? "Review required" : "No action needed"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Future Visitors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {futureVisitors}
          </CardTitle>
          <CardAction>
            <IconClock className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Scheduled visits
          </div>
          <div className="text-muted-foreground">Upcoming this week</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rooms Occupied</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {roomsOccupied}
          </CardTitle>
          <CardAction>
            <IconHome className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active bookings
          </div>
          <div className="text-muted-foreground">Room utilization</div>
        </CardFooter>
      </Card>
    </div>
  );
}
