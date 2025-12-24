import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function StreamCreate({ auth, classItem, stream, teachers }) {
    const isEdit = !!stream;
    
    const { data, setData, post, put, processing, errors } = useForm({
        class_id: classItem?.id || stream?.class_id || '',
        name: stream?.name || '',
        teacher_id: stream?.teacher_id?.toString() || '',
        capacity: stream?.capacity?.toString() || '40',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/classes/${classItem.id}/streams/${stream.id}`);
        } else {
            post(`/classes/${classItem.id}/streams`);
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={isEdit ? 'Edit Stream' : 'Add Stream'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/classes/${classItem.id}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Stream' : 'Add New Stream'}
                            </h2>
                            <p className="text-muted-foreground">
                                {classItem?.name} - {isEdit ? 'Update stream information' : 'Create a new stream'}
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
                                            <SelectItem value="">No class teacher</SelectItem>
                                            {teachers?.map((teacher) => (
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
                                        {processing ? 'Saving...' : (isEdit ? 'Update Stream' : 'Create Stream')}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={`/classes/${classItem.id}`}>Cancel</Link>
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