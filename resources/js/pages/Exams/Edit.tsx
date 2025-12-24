import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Edit({ auth, exam, terms, classes }) {
    const { data, setData, put, processing, errors } = useForm({
        term_id: exam.term_id?.toString() || '',
        class_id: exam.class_id?.toString() || '',
        name: exam.name || '',
        type: exam.type || '',
        exam_date: exam.exam_date || '',
        total_marks: exam.total_marks?.toString() || '100',
        description: exam.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/exams/${exam.id}`);
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Edit Exam" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/exams">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Edit Exam</h2>
                            <p className="text-muted-foreground">Update exam information</p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Exam Details</CardTitle>
                            <CardDescription>Modify the exam information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Exam Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., CAT 1, Mid-Term Exam"
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">
                                            Exam Type <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cat">CAT</SelectItem>
                                                <SelectItem value="mid_term">Mid-Term</SelectItem>
                                                <SelectItem value="end_term">End-Term</SelectItem>
                                                <SelectItem value="mock">Mock</SelectItem>
                                                <SelectItem value="kcse">KCSE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="exam_date">
                                            Exam Date <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="exam_date"
                                            type="date"
                                            value={data.exam_date}
                                            onChange={(e) => setData('exam_date', e.target.value)}
                                        />
                                        {errors.exam_date && <p className="text-sm text-destructive">{errors.exam_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="total_marks">
                                            Total Marks <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="total_marks"
                                            type="number"
                                            value={data.total_marks}
                                            onChange={(e) => setData('total_marks', e.target.value)}
                                            placeholder="100"
                                        />
                                        {errors.total_marks && <p className="text-sm text-destructive">{errors.total_marks}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Additional notes about the exam"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Exam'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/exams">Cancel</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}