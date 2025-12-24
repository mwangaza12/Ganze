import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function EnterMarks({ auth, exam, students, subjects, existingMarks }) {
    const [marks, setMarks] = useState({});
    const [processing, setProcessing] = useState(false);

    // Initialize marks from existing data
    React.useEffect(() => {
        const initialMarks = {};
        students?.forEach(student => {
            subjects?.forEach(subject => {
                const key = `${student.id}-${subject.id}`;
                const existing = existingMarks?.[student.id]?.find(m => m.subject_id === subject.id);
                initialMarks[key] = {
                    student_id: student.id,
                    subject_id: subject.id,
                    marks_obtained: existing?.marks_obtained || '',
                    total_marks: exam.total_marks,
                    remarks: existing?.remarks || ''
                };
            });
        });
        setMarks(initialMarks);
    }, [students, subjects, existingMarks, exam.total_marks]);

    const handleMarksChange = (studentId, subjectId, field, value) => {
        const key = `${studentId}-${subjectId}`;
        setMarks(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const marksArray = Object.values(marks).filter(m => m.marks_obtained !== '');

        router.post(`/exams/${exam.id}/marks`, {
            marks: marksArray
        }, {
            onFinish: () => setProcessing(false)
        });
    };

    const calculateGrade = (obtained, total) => {
        if (!obtained || !total) return '';
        const percentage = (parseFloat(obtained) / parseFloat(total)) * 100;
        if (percentage >= 80) return 'A';
        if (percentage >= 75) return 'A-';
        if (percentage >= 70) return 'B+';
        if (percentage >= 65) return 'B';
        if (percentage >= 60) return 'B-';
        if (percentage >= 55) return 'C+';
        if (percentage >= 50) return 'C';
        if (percentage >= 45) return 'C-';
        if (percentage >= 40) return 'D+';
        if (percentage >= 35) return 'D';
        if (percentage >= 30) return 'D-';
        return 'E';
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Enter Marks - ${exam.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/exams/${exam.id}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Enter Marks</h2>
                            <p className="text-muted-foreground">
                                {exam.name} • {exam.class?.name} • Out of {exam.total_marks}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Student Marks Entry</CardTitle>
                                <Button onClick={handleSubmit} disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save All Marks'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {students?.map((student) => (
                                    <Card key={student.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold">{student.full_name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {student.admission_number}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {subjects?.map((subject) => {
                                                    const key = `${student.id}-${subject.id}`;
                                                    const mark = marks[key];
                                                    const grade = calculateGrade(mark?.marks_obtained, mark?.total_marks);

                                                    return (
                                                        <div key={subject.id} className="space-y-2 p-4 border rounded-lg">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <Label className="font-medium">{subject.name}</Label>
                                                                {grade && <Badge>{grade}</Badge>}
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <Input
                                                                    type="number"
                                                                    value={mark?.marks_obtained || ''}
                                                                    onChange={(e) => handleMarksChange(
                                                                        student.id,
                                                                        subject.id,
                                                                        'marks_obtained',
                                                                        e.target.value
                                                                    )}
                                                                    placeholder="0"
                                                                    className="w-20"
                                                                    min="0"
                                                                    max={exam.total_marks}
                                                                />
                                                                <span className="text-sm text-muted-foreground">
                                                                    / {exam.total_marks}
                                                                </span>
                                                            </div>
                                                            <Input
                                                                value={mark?.remarks || ''}
                                                                onChange={(e) => handleMarksChange(
                                                                    student.id,
                                                                    subject.id,
                                                                    'remarks',
                                                                    e.target.value
                                                                )}
                                                                placeholder="Remarks (optional)"
                                                                className="text-sm"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button onClick={handleSubmit} disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save All Marks'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={`/exams/${exam.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}