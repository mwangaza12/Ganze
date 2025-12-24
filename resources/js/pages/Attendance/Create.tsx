import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Create({ auth, classes, selectedClass, students, date }:{}) {
    const [attendanceData, setAttendanceData] = useState({});
    const { data, setData, post, processing, errors } = useForm({
        class_id: selectedClass?.id || '',
        date: date,
        attendance: []
    });

    useEffect(() => {
        if (students) {
            const initialData = {};
            students.forEach(student => {
                const existing = student.attendance?.[0];
                initialData[student.id] = {
                    student_id: student.id,
                    status: existing?.status || 'present',
                    remarks: existing?.remarks || ''
                };
            });
            setAttendanceData(initialData);
        }
    }, [students]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleRemarksChange = (studentId, remarks) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const attendance = Object.values(attendanceData);
        post('/attendance', {
            class_id: data.class_id,
            date: data.date,
            attendance: attendance
        });
    };

    const loadClass = () => {
        router.get('/attendance/create', {
            class_id: data.class_id,
            date: data.date
        }, {
            preserveState: true
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            present: { variant: 'default', label: 'Present' },
            absent: { variant: 'destructive', label: 'Absent' },
            late: { variant: 'secondary', label: 'Late' },
            excused: { variant: 'outline', label: 'Excused' }
        };
        return badges[status] || badges.present;
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Mark Attendance" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/attendance">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>
                            <p className="text-muted-foreground">Record student attendance for the day</p>
                        </div>
                    </div>

                    {/* Selection Form */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Select Class and Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Class</Label>
                                    <Select value={data.class_id.toString()} onValueChange={(value) => setData('class_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={loadClass} className="w-full">
                                        Load Students
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Table */}
                    {students && students.length > 0 && (
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Students in {selectedClass?.name} - {data.date}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Admission No.</TableHead>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Remarks</TableHead>
                                                <TableHead>Quick Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-medium">
                                                        {student.admission_number}
                                                    </TableCell>
                                                    <TableCell>{student.full_name}</TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={attendanceData[student.id]?.status}
                                                            onValueChange={(value) => handleStatusChange(student.id, value)}
                                                        >
                                                            <SelectTrigger className="w-[130px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="present">Present</SelectItem>
                                                                <SelectItem value="absent">Absent</SelectItem>
                                                                <SelectItem value="late">Late</SelectItem>
                                                                <SelectItem value="excused">Excused</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={attendanceData[student.id]?.remarks || ''}
                                                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                            placeholder="Optional remarks"
                                                            className="w-[200px]"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleStatusChange(student.id, 'present')}
                                                            >
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleStatusChange(student.id, 'absent')}
                                                            >
                                                                <X className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <div className="flex gap-4 mt-6">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Attendance'}
                                        </Button>
                                        <Button type="button" variant="outline" asChild>
                                            <Link href="/attendance">Cancel</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}