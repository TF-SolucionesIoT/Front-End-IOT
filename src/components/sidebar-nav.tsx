'use client';

import {
  LayoutDashboard,
  HeartPulse,
  Siren,
  Pill,
  Users,
  Settings,
  History,
  UserCircle,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';

const defaultLinks = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/vitals', label: 'Vitals', icon: HeartPulse },
  { href: '/emergencies', label: 'Emergencies', icon: Siren },
  { href: '/treatments', label: 'Treatments', icon: Pill },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/alterations', label: 'Alterations', icon: History },
  { href: '/symptoms', label: 'Symptoms', icon: History },
  { href: '/settings/profile', label: 'Settings', icon: Settings },
];

const caregiverLinks = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/caregiver/patient', label: 'Datos del Paciente', icon: UserCircle },
  { href: '/vitals', label: 'Vitals', icon: HeartPulse },
  { href: '/emergencies', label: 'Emergencies', icon: Siren },
  { href: '/settings/profile', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();
  
  const isCaregiver = user?.typeOfUser === 'CAREGIVER';
  const links = isCaregiver ? caregiverLinks : defaultLinks;

  return (
    <div className="p-2">
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <Link href={link.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))}
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
