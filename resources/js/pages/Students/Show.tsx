import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Pencil, User, GraduationCap, DollarSign, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Show({ auth, student }:{ auth: any; student: any }) {
    const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
        const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
            active: 'default',
            transferred: 'secondary',
            graduated: 'outline',
            expelled: 'destructive',
            withdrawn: 'secondary',
        };
        return variants[status] || 'default';
    };

    return (
        <AppLayout breadcrumbs={auth.user}>
            <Head title={`Student - ${student.full_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/students">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{student.full_name}</h2>
                                <p className="text-muted-foreground">
                                    Admission No: {student.admission_number}
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/students/${student.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Student
                            </Link>
                        </Button>
                    </div>

                    {/* Student Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant={getStatusVariant(student.status)}>
                                    {student.status}
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Class</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    {student.class?.name}
                                    {student.stream && ` - ${student.stream.name}`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Age</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{student.age} years</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Gender</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold capitalize">{student.gender}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="info" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="info">
                                <User className="mr-2 h-4 w-4" />
                                Information
                            </TabsTrigger>
                            <TabsTrigger value="guardians">
                                <User className="mr-2 h-4 w-4" />
                                Guardians
                            </TabsTrigger>
                            <TabsTrigger value="attendance">
                                <Calendar className="mr-2 h-4 w-4" />
                                Attendance
                            </TabsTrigger>
                            <TabsTrigger value="exams">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                Exams
                            </TabsTrigger>
                            <TabsTrigger value="fees">
                                <DollarSign className="mr-2 h-4 w-4" />
                                Fees
                            </TabsTrigger>
                        </TabsList>

                        {/* Information Tab */}
                        <TabsContent value="info">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <p className="text-sm text-muted-foreground">Full Name:</p>
                                            <p className="text-sm font-medium">{student.full_name}</p>
                                            
                                            <p className="text-sm text-muted-foreground">Date of Birth:</p>
                                            <p className="text-sm font-medium">{student.date_of_birth}</p>
                                            
                                            <p className="text-sm text-muted-foreground">Birth Certificate:</p>
                                            <p className="text-sm font-medium">{student.birth_certificate_number || 'N/A'}</p>
                                            
                                            <p className="text-sm text-muted-foreground">Admission Date:</p>
                                            <p className="text-sm font-medium">{student.admission_date}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <p className="text-sm text-muted-foreground">County:</p>
                                            <p className="text-sm font-medium">{student.county || 'N/A'}</p>
                                            
                                            <p className="text-sm text-muted-foreground">Sub County:</p>
                                            <p className="text-sm font-medium">{student.sub_county || 'N/A'}</p>
                                            
                                            <p className="text-sm text-muted-foreground">Address:</p>
                                            <p className="text-sm font-medium">{student.address || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Medical Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Medical Conditions:</p>
                                            <p className="text-sm">{student.medical_conditions || 'None'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Allergies:</p>
                                            <p className="text-sm">{student.allergies || 'None'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Guardians Tab */}
                        <TabsContent value="guardians">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Parent/Guardian Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {student.guardians && student.guardians.length > 0 ? (
                                        <div className="space-y-4">
                                            {student.guardians.map((guardian: any) => (
                                                <Card key={guardian.id}>
                                                    <CardContent className="pt-6">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Name:</p>
                                                                <p className="font-medium">{guardian.full_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Relationship:</p>
                                                                <p className="font-medium capitalize">{guardian.relationship}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Phone:</p>
                                                                <p className="font-medium">{guardian.phone}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Email:</p>
                                                                <p className="font-medium">{guardian.email || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No guardian information available</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Attendance Tab */}
                        <TabsContent value="attendance">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Attendance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {student.attendance && student.attendance.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Remarks</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {student.attendance.map((record: any) => (
                                                    <TableRow key={record.id}>
                                                        <TableCell>{record.date}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                                                                {record.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{record.remarks || '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted-foreground">No attendance records</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Exams Tab */}
                        <TabsContent value="exams">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Exam Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {student.marks && student.marks.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Exam</TableHead>
                                                    <TableHead>Subject</TableHead>
                                                    <TableHead>Marks</TableHead>
                                                    <TableHead>Grade</TableHead>
                                                    <TableHead>Points</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {student.marks.map((mark: any) => (
                                                    <TableRow key={mark.id}>
                                                        <TableCell>{mark.exam?.name}</TableCell>
                                                        <TableCell>{mark.subject?.name}</TableCell>
                                                        <TableCell>{mark.marks_obtained}/{mark.total_marks}</TableCell>
                                                        <TableCell><Badge>{mark.grade}</Badge></TableCell>
                                                        <TableCell>{mark.points}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted-foreground">No exam results available</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Fees Tab */}
                        <TabsContent value="fees">
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fee Balance Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Due</p>
                                                <p className="text-2xl font-bold">
                                                    KSh {student.fees?.reduce(({sum, fee}: {sum: any, fee: any}) => sum + parseFloat(fee.amount_due), 0).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Paid</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    KSh {student.fees?.reduce(({sum, fee}: {sum: any, fee: any}) => sum + parseFloat(fee.amount_paid), 0).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Balance</p>
                                                <p className="text-2xl font-bold text-red-600">
                                                    KSh {student.fees?.reduce(({sum, fee}: {sum: any, fee: any}) => sum + parseFloat(fee.balance), 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {student.payments && student.payments.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Receipt No.</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Amount</TableHead>
                                                        <TableHead>Method</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {student.payments.map((payment: any) => (
                                                        <TableRow key={payment.id}>
                                                            <TableCell className="font-medium">{payment.receipt_number}</TableCell>
                                                            <TableCell>{payment.payment_date}</TableCell>
                                                            <TableCell>KSh {parseFloat(payment.amount).toLocaleString()}</TableCell>
                                                            <TableCell className="capitalize">{payment.payment_method}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <p className="text-muted-foreground">No payment history</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}