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
import { type NavItem } from '@/types';
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

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Students',
        href: '/students',
        icon: Users,
        items: [
            {
                title: 'All Students',
                href: '/students',
            },
            {
                title: 'Add Student',
                href: '/students/create',
            },
        ],
    },
    {
        title: 'Teachers',
        href: '/teachers',
        icon: GraduationCap,
        items: [
            {
                title: 'All Teachers',
                href: '/teachers',
            },
            {
                title: 'Add Teacher',
                href: '/teachers/create',
            },
        ],
    },
    {
        title: 'Guardians',
        href: '/guardians',
        icon: UserCircle,
        items: [
            {
                title: 'All Guardians',
                href: '/guardians',
            },
            {
                title: 'Add Guardian',
                href: '/guardians/create',
            },
        ],
    },
    {
        title: 'Classes & Streams',
        href: '/classes',
        icon: School,
        items: [
            {
                title: 'All Classes',
                href: '/classes',
            },
            {
                title: 'Add Class',
                href: '/classes/create',
            },
        ],
    },
    {
        title: 'Subjects',
        href: '/subjects',
        icon: BookOpen,
        items: [
            {
                title: 'All Subjects',
                href: '/subjects',
            },
            {
                title: 'Add Subject',
                href: '/subjects/create',
            },
        ],
    },
    {
        title: 'Attendance',
        href: '/attendance',
        icon: ClipboardCheck,
        items: [
            {
                title: 'View Attendance',
                href: '/attendance',
            },
            {
                title: 'Mark Attendance',
                href: '/attendance/create',
            },
        ],
    },
    {
        title: 'Exams & Results',
        href: '/exams',
        icon: FileText,
        items: [
            {
                title: 'All Exams',
                href: '/exams',
            },
            {
                title: 'Add Exam',
                href: '/exams/create',
            },
            {
                title: 'Enter Marks',
                href: '/exams',
            },
        ],
    },
    {
        title: 'Fees & Payments',
        href: '/fees',
        icon: DollarSign,
        items: [
            {
                title: 'Fee Structures',
                href: '/fees',
            },
            {
                title: 'Record Payment',
                href: '/payments/create',
            },
            {
                title: 'Payment History',
                href: '/payments',
            },
            {
                title: 'Fee Defaulters',
                href: '/reports/fees/defaulters',
            },
        ],
    },
    {
        title: 'Events',
        href: '/events',
        icon: Calendar,
        items: [
            {
                title: 'All Events',
                href: '/events',
            },
            {
                title: 'Add Event',
                href: '/events/create',
            },
            {
                title: 'Upcoming Events',
                href: '/events/upcoming',
            },
        ],
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
        items: [
            {
                title: 'Attendance Report',
                href: '/reports/attendance',
            },
            {
                title: 'Academic Report',
                href: '/reports/academic',
            },
            {
                title: 'Fees Summary',
                href: '/reports/fees/summary',
            },
        ],
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        items: [
            {
                title: 'Academic Years',
                href: '/academic-years',
            },
            {
                title: 'Terms',
                href: '/terms',
            },
            {
                title: 'System Settings',
                href: '/settings',
            },
        ],
    },
];

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}