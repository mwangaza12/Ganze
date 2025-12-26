import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function CreateEdit({ auth, classItem }: { auth: any, classItem: any}) {
    const isEdit = !!classItem;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: classItem?.name || '',
        level: classItem?.level?.toString() || '',
        capacity: classItem?.capacity?.toString() || '40',
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/classes/${classItem.id}`);
        } else {
            post('/classes');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Classes",
            href: "/classes"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Class' : 'Add Class'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Class' : 'Add New Class'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update class information' : 'Create a new class'}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Class Details</CardTitle>
                            <CardDescription>Enter the class information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Class Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Form 1, Form 2"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Enter the class name (Form 1, Form 2, Form 3, Form 4)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="level">
                                        Level <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="level"
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={data.level}
                                        onChange={(e) => setData('level', e.target.value)}
                                        placeholder="1, 2, 3, or 4"
                                    />
                                    {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Enter the form level (1-4)
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
                                        Maximum number of students in this class
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Saving...' : (isEdit ? 'Update Class' : 'Create Class')}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/classes">Cancel</Link>
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