import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, FileText } from 'lucide-react';

export default function Show({ auth, exam }) {
    const getTypeBadge = (type) => {
        const badges = {
            cat: { variant: 'secondary', label: 'CAT' },
            mid_term: { variant: 'default', label: 'Mid-Term' },
            end_term: { variant: 'default', label: 'End-Term' },
            mock: { variant: 'outline', label: 'Mock' },
            kcse: { variant: 'destructive', label: 'KCSE' }
        };
        return badges[type] || badges.cat;
    };

    const typeBadge = getTypeBadge(exam.type);

    return (
        <AppLayout user={auth.user}>
            <Head title={`Exam - ${exam.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/exams">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-3xl font-bold tracking-tight">{exam.name}</h2>
                                    <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                                </div>
                                <p className="text-muted-foreground">
                                    {exam.class?.name} • {exam.term?.name} - {exam.term?.academic_year?.year}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href={`/exams/${exam.id}/enter-marks`}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Enter Marks
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/exams/${exam.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Exam Date</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{exam.exam_date}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Marks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{exam.total_marks}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{exam.marks?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">Marks entered</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Exam Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-sm text-muted-foreground">Class:</p>
                                    <p className="text-sm font-medium">{exam.class?.name}</p>

                                    <p className="text-sm text-muted-foreground">Term:</p>
                                    <p className="text-sm font-medium">{exam.term?.name}</p>

                                    <p className="text-sm text-muted-foreground">Academic Year:</p>
                                    <p className="text-sm font-medium">{exam.term?.academic_year?.year}</p>

                                    <p className="text-sm text-muted-foreground">Type:</p>
                                    <p className="text-sm font-medium capitalize">{exam.type.replace('_', ' ')}</p>

                                    <p className="text-sm text-muted-foreground">Total Marks:</p>
                                    <p className="text-sm font-medium">{exam.total_marks}</p>
                                </div>

                                {exam.description && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Description:</p>
                                        <p className="text-sm">{exam.description}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {exam.marks && exam.marks.length > 0 && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Student Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {exam.marks.slice(0, 10).map((mark) => (
                                        <div key={mark.id} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{mark.student?.full_name}</p>
                                                <p className="text-sm text-muted-foreground">{mark.subject?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{mark.marks_obtained}/{mark.total_marks}</p>
                                                <Badge>{mark.grade}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {exam.marks.length > 10 && (
                                    <p className="text-sm text-muted-foreground mt-4">
                                        Showing 10 of {exam.marks.length} results
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
