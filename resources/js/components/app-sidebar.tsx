import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Users, 
    GraduationCap,
    BookOpen,
    School,
    ClipboardCheck,
    FileText,
    DollarSign,
    Calendar,
    BarChart3,
    Settings,
    UserCircle
} from 'lucide-react';
import AppLogo from './app-logo';

const navGroups: NavGroup[] = [
  {
      label: 'Overview',
      items: [
          {
              title: 'Dashboard',
              href: dashboard(),
              icon: LayoutGrid,
          },
      ],
      title: ''
  },

  {
      label: 'People',
      items: [
          {
              title: 'Students',
              href: '/students',
              icon: Users,
          },
          {
              title: 'Teachers',
              href: '/teachers',
              icon: GraduationCap,
          },
          {
              title: 'Guardians',
              href: '/guardians',
              icon: UserCircle,              
          },
      ],
      title: ''
  },

  {
      label: 'Academics',
      items: [
          {
              title: 'Classes & Streams',
              href: '/classes',
              icon: School,
          },
          {
              title: 'Subjects',
              href: '/subjects',
              icon: BookOpen,
          },
          {
              title: 'Attendance',
              href: '/attendance',
              icon: ClipboardCheck,
              items: [
                  { title: 'View Attendance', href: '/attendance' },
                  { title: 'Mark Attendance', href: '/attendance/create' },
              ],
          },
          {
              title: 'Exams & Results',
              href: '/exams',
              icon: FileText,
          },
      ],
      title: ''
  },

  {
      label: 'Finance',
      items: [
          {
              title: 'Fees & Payments',
              href: '/fees',
              icon: DollarSign,
              items: [
                  { title: 'Fee Structures', href: '/fees' },
                  { title: 'Record Payment', href: '/payments/create' },
                  { title: 'Payment History', href: '/payments' },
              ],
          },
      ],
      title: ''
  },

  {
      label: 'Reports & Events',
      items: [
          {
              title: 'Events',
              href: '/events',
              icon: Calendar,
          },
          {
              title: 'Reports',
              href: '/reports',
              icon: BarChart3,
              items: [
                  { title: 'Attendance Report', href: '/reports/attendance' },
                  { title: 'Academic Report', href: '/reports/academic' },
                  { title: 'Fee Report', href: '/reports/fees/summary' },
              ],
          },
      ],
      title: ''
  },

  {
      label: 'System',
      items: [
          {
              title: 'Settings',
              href: '/settings',
              icon: Settings,
              items: [
                  { title: 'Academic Years', href: '/academic-years' },
                  { title: 'Terms', href: '/terms' },
                  { title: 'System Settings', href: '/settings' },
              ],
          },
      ],
      title: ''
  },
]


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}