"use client";

import {
  LayoutDashboard,
  HeartPulse,
  Siren,
  Pill,
  Users,
  Settings,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/vitals", label: "Vitals", icon: HeartPulse },
  { href: "/app/emergencies", label: "Emergencies", icon: Siren },
  { href: "/app/treatments", label: "Treatments", icon: Pill },
  { href: "/app/contacts", label: "Contacts", icon: Users },
  { href: "/app/settings/profile", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="p-2">
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <Link href={link.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname.startsWith(link.href)}
                tooltip={{
                  children: link.label,
                }}
              >
                <link.icon />
                <span>{link.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
