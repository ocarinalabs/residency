"use client";

import * as React from "react";
import {
  IconBuildingCommunity,
  IconChartBar,
  IconDashboard,
  IconDoorEnter,
  IconHelp,
  IconHome,
  IconSearch,
  IconSettings,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Adelyn Chan",
    email: "adelyn.chan@500.co",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Visitor Management",
      url: "#",
      icon: IconUsers,
      items: [
        {
          title: "Today's Visitors",
          url: "#",
        },
        {
          title: "Future Visitors",
          url: "#",
        },
        {
          title: "Pending Approvals",
          url: "#",
        },
        {
          title: "Visitor Database",
          url: "#",
        },
      ],
    },
    {
      title: "Room Management",
      url: "#",
      icon: IconHome,
      items: [
        {
          title: "Room Occupancy",
          url: "#",
        },
        {
          title: "Bookings Calendar",
          url: "#",
        },
        {
          title: "Room Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Access Control",
      url: "#",
      icon: IconDoorEnter,
      items: [
        {
          title: "Door Access",
          url: "#",
        },
        {
          title: "Blacklist",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
      items: [
        {
          title: "Visitor Trends",
          url: "#",
        },
        {
          title: "Room Utilization",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  quickActions: [
    {
      name: "Approve Visitor",
      url: "#",
      icon: IconUserCheck,
    },
    {
      name: "Check Building",
      url: "#",
      icon: IconBuildingCommunity,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconBuildingCommunity className="!size-5" />
                <span className="text-base font-semibold">
                  500 Social House
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.quickActions && data.quickActions.length > 0 && (
          <NavDocuments items={data.quickActions} label="Quick Actions" />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
