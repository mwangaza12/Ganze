import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    UserCheck, 
    UserX, 
    GraduationCap, 
    DollarSign, 
    Calendar,
    BookOpen,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard'
    },
];

export default function Dashboard({ auth, stats, role }: { auth: any; stats: any; role: string }) {
    // Admin/Principal Dashboard
    const renderAdminDashboard = () => (
        <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_students}</div>
                        <p className="text-xs text-muted-foreground">Active students</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_teachers}</div>
                        <p className="text-xs text-muted-foreground">Teaching staff</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.present_today}</div>
                        <p className="text-xs text-muted-foreground">Students in attendance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.absent_today}</div>
                        <p className="text-xs text-muted-foreground">Students absent</p>
                    </CardContent>
                </Card>
            </div>

            {/* Financial Stats */}
            <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fees Collected (This Month)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            KSh {stats.fees_collected_this_month?.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Total payments received</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            KSh {stats.outstanding_fees?.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Total balance due</p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Events */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.upcoming_events && stats.upcoming_events.length > 0 ? (
                        <div className="space-y-3">
                            {stats.upcoming_events.map((event: any) => (
                                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{event.title}</p>
                                            <p className="text-sm text-muted-foreground">{event.event_date}</p>
                                        </div>
                                    </div>
                                    <Badge>{event.type}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No upcoming events</p>
                    )}
                </CardContent>
            </Card>
        </>
    );

    // Teacher Dashboard
    const renderTeacherDashboard = () => (
        <>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.my_classes?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Classes assigned</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Subjects</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.my_subjects?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Subjects teaching</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Marked</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.attendance_marked_today || 0}</div>
                        <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
            </div>

            {/* My Classes */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>My Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.my_classes && stats.my_classes.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                            {stats.my_classes.map((stream: any) => (
                                <div key={stream.id} className="p-4 border rounded-lg">
                                    <h3 className="font-semibold">{stream.class?.name} - {stream.name}</h3>
                                    <p className="text-sm text-muted-foreground">Class Teacher</p>
                                    <Button size="sm" variant="outline" className="mt-2" asChild>
                                        <Link href={`/classes/${stream.class_id}`}>View Class</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No classes assigned</p>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.upcoming_events && stats.upcoming_events.length > 0 ? (
                        <div className="space-y-3">
                            {stats.upcoming_events.map((event: any) => (
                                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{event.title}</p>
                                            <p className="text-sm text-muted-foreground">{event.event_date}</p>
                                        </div>
                                    </div>
                                    <Badge>{event.type}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No upcoming events</p>
                    )}
                </CardContent>
            </Card>
        </>
    );

    // Parent Dashboard
    const renderParentDashboard = () => (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>My Children</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.children && stats.children.length > 0 ? (
                        <div className="space-y-4">
                            {stats.children.map((child: any) => (
                                <Card key={child.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">{child.full_name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {child.admission_number} • {child.class?.name}
                                                </p>
                                            </div>
                                            <Button size="sm" asChild>
                                                <Link href={`/students/${child.id}`}>View Details</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No children registered</p>
                    )}
                </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Today's Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.attendance_summary && stats.attendance_summary.length > 0 ? (
                        <div className="space-y-3">
                            {stats.attendance_summary.map((summary: any) => (
                                <div key={summary.student.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{summary.student.full_name}</p>
                                        <p className="text-sm text-muted-foreground">{summary.student.class?.name}</p>
                                    </div>
                                    <Badge variant={summary.today_status === 'present' ? 'default' : 'destructive'}>
                                        {summary.today_status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No attendance data</p>
                    )}
                </CardContent>
            </Card>

            {/* Fees Summary */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Fee Balances</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.fees_summary && stats.fees_summary.length > 0 ? (
                        <div className="space-y-3">
                            {stats.fees_summary.map((summary: any) => (
                                <div key={summary.student.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{summary.student.full_name}</p>
                                        <p className="text-sm text-muted-foreground">Fee Balance</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${summary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            KSh {summary.balance?.toLocaleString()}
                                        </p>
                                        <Button size="sm" variant="outline" className="mt-1" asChild>
                                            <Link href={`/students/${summary.student.id}/payments/create`}>
                                                Make Payment
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No fee information</p>
                    )}
                </CardContent>
            </Card>
        </>
    );

    // Student Dashboard
    const renderStudentDashboard = () => (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>My Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm text-muted-foreground">Name:</p>
                            <p className="text-sm font-medium">{stats.student_info?.full_name}</p>
                            
                            <p className="text-sm text-muted-foreground">Admission No:</p>
                            <p className="text-sm font-medium">{stats.student_info?.admission_number}</p>
                            
                            <p className="text-sm text-muted-foreground">Class:</p>
                            <p className="text-sm font-medium">
                                {stats.student_info?.class?.name}
                                {stats.student_info?.stream && ` - ${stats.student_info.stream.name}`}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance This Month */}
            <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present This Month</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.attendance_this_month?.present || 0} days
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absent This Month</CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats.attendance_this_month?.absent || 0} days
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fee Balance */}
            <Card className="mt-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fee Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${stats.fees_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        KSh {stats.fees_balance?.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Outstanding amount</p>
                </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.upcoming_events && stats.upcoming_events.length > 0 ? (
                        <div className="space-y-3">
                            {stats.upcoming_events.map((event: any) => (
                                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{event.title}</p>
                                            <p className="text-sm text-muted-foreground">{event.event_date}</p>
                                        </div>
                                    </div>
                                    <Badge>{event.type}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No upcoming events</p>
                    )}
                </CardContent>
            </Card>
        </>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">
                            Welcome back, {auth.user.name}!
                        </p>
                    </div>
                    {renderAdminDashboard()}
                    {/* {role === 'admin' || role === 'principal' ? renderAdminDashboard() : null}
                    {role === 'teacher' ? renderTeacherDashboard() : null}
                    {role === 'parent' ? renderParentDashboard() : null}
                    {role === 'student' ? renderStudentDashboard() : null} */}
                </div>
            </div>
        </AppLayout>
    );
}