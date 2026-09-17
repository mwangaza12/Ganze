import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function StreamEdit({ stream, grade, teachers }: { stream: any, grade: any, teachers: any }) {
    const { data, setData, put, processing, errors, transform } = useForm({
        name: stream?.name || '',
        teacher_id: stream?.teacher_id?.toString() ?? 'all',
        capacity: stream?.capacity?.toString() || '40',
    });

    transform((formData) => ({
        ...formData,
        teacher_id: formData.teacher_id === 'all' ? null : formData.teacher_id,
    }));

    const handleSubmit = (e: any) => {
        e.preventDefault();
        put(`/grades/${grade.id}/streams/${stream.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Edit Stream",
            href: "/grades",
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Stream" />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/grades/${grade.id}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Edit Stream</h2>
                            <p className="text-muted-foreground">
                                {grade?.name} - Update stream information
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stream Details</CardTitle>
                            <CardDescription>Enter the stream information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Stream Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., A, B, East, West"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="teacher_id">Class Teacher</Label>
                                    <Select value={data.teacher_id} onValueChange={(value) => setData('teacher_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class teacher (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">No class teacher</SelectItem>
                                            {teachers?.map((teacher: any) => (
                                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                    {teacher.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity">
                                        Capacity <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        placeholder="40"
                                    />
                                    {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Saving...' : 'Update Stream'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={`/grades/${grade.id}`}>Cancel</Link>
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