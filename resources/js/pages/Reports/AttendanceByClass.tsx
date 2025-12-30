import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function AttendanceByClass({ classData, report, startDate, endDate }: { classData: any; report: any; startDate: string; endDate: string; }) {
    const [start, setStart] = React.useState(startDate);
    const [end, setEnd] = React.useState(endDate);

    const handleFilter = () => {
        router.get(`/reports/attendance/class/${classData.id}`, {
            start_date: start,
            end_date: end
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reports',
            href: '/reports',
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Attendance Report - ${classData.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/reports">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Attendance Report - {classData.name}
                                </h2>
                                <p className="text-muted-foreground">
                                    {startDate} to {endDate}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div>
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={handleFilter}>Update Report</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Student Attendance Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Student</th>
                                            <th className="text-center p-3">Total Days</th>
                                            <th className="text-center p-3">Present</th>
                                            <th className="text-center p-3">Absent</th>
                                            <th className="text-center p-3">Late</th>
                                            <th className="text-center p-3">Attendance %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report?.map((record: any) => (
                                            <tr key={record.student.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">{record.student.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {record.student.admission_number}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="text-center p-3">{record.total_days}</td>
                                                <td className="text-center p-3">
                                                    <Badge variant="default">{record.present}</Badge>
                                                </td>
                                                <td className="text-center p-3">
                                                    <Badge variant="destructive">{record.absent}</Badge>
                                                </td>
                                                <td className="text-center p-3">
                                                    <Badge variant="secondary">{record.late}</Badge>
                                                </td>
                                                <td className="text-center p-3">
                                                    <Badge variant={record.percentage >= 80 ? 'default' : 'destructive'}>
                                                        {record.percentage}%
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
