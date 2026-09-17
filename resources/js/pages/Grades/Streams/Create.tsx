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

export default function StreamCreate({ gradeItem, teachers }: { gradeItem: any, teachers: any }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        teacher_id: 'all',
        capacity: '40',
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();

        post(`/grades/${gradeItem.id}/streams`, {
            data: {
                ...data,
                teacher_id: data.teacher_id === 'all' ? null : data.teacher_id,
            },
        } as any);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Add Stream",
            href: "/grades",
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Stream" />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/grades/${gradeItem.id}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Add New Stream</h2>
                            <p className="text-muted-foreground">
                                {gradeItem?.name} - Create a new stream
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
                                    <p className="text-sm text-muted-foreground">
                                        Common stream names: A, B, C, D or East, West, North, South
                                    </p>
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
                                    <p className="text-sm text-muted-foreground">
                                        Assign a class teacher to this stream
                                    </p>
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
                                    <p className="text-sm text-muted-foreground">
                                        Maximum number of students in this stream
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Saving...' : 'Create Stream'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={`/grades/${gradeItem.id}`}>Cancel</Link>
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