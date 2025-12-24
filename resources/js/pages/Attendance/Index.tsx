import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

function Index({ auth, attendance, classes, filters }: {auth: any, attendance: any, classes: any, filters: any}) {
    const [date, setDate] = React.useState(filters.date || '');
    const [classId, setClassId] = React.useState(filters.class_id ?? 'all');
    const [status, setStatus] = React.useState(filters.status ?? 'all');

    const handleFilter = () => {
        router.get('/attendance', { date, class_id: classId, status }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={auth.user}>
            <Head title="Attendance" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Attendance Records</h2>
                            <p className="text-muted-foreground">View and manage student attendance</p>
                        </div>
                        <Button asChild>
                            <Link href="/attendance/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Mark Attendance
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <Select value={classId} onValueChange={setClassId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Classes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classes</SelectItem>
                                        {classes?.map((cls: any) => (
                                            <SelectItem key={cls.id} value={cls.id.toString()}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="present">Present</SelectItem>
                                        <SelectItem value="absent">Absent</SelectItem>
                                        <SelectItem value="late">Late</SelectItem>
                                        <SelectItem value="excused">Excused</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter}>Apply Filters</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {attendance.data.map((record: any) => (
                                    <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{record.student?.full_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {record.student?.admission_number} • {record.date}
                                            </p>
                                        </div>
                                        <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                                            {record.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>

                            {attendance.links && attendance.links.length > 3 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {attendance.from} to {attendance.to} of {attendance.total} results
                                    </div>
                                    <div className="flex gap-1">
                                        {attendance.links.map(({link, index}:{link: any, index: any}) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default Index;
