import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function SubjectCreateEdit({ subject }: { subject: any}) {
    const isEdit = !!subject;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: subject?.name || '',
        code: subject?.code || '',
        category: subject?.category || '',
        is_active: subject?.is_active ?? true,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/subjects/${subject.id}`);
        } else {
            post('/subjects');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Subjects",
            href: "/subjects"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Subject' : 'Add Subject'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Subject' : 'Add New Subject'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update subject information' : 'Create a new subject'}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Subject Details</CardTitle>
                            <CardDescription>Enter the subject information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Subject Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Mathematics, English, Kiswahili"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">
                                        Subject Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g., MATH, ENG, KIS"
                                        maxLength={10}
                                    />
                                    {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Short code for the subject (e.g., MATH for Mathematics)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="compulsory">Compulsory</SelectItem>
                                            <SelectItem value="science">Science</SelectItem>
                                            <SelectItem value="humanities">Humanities</SelectItem>
                                            <SelectItem value="technical">Technical</SelectItem>
                                            <SelectItem value="language">Language</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Subject category helps in organizing subjects by department
                                    </p>
                                </div>

                                <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_active">Active Status</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enable or disable this subject
                                        </p>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Saving...' : (isEdit ? 'Update Subject' : 'Create Subject')}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/subjects">Cancel</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Common Kenyan Secondary School Subjects Reference */}
                    {!isEdit && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-base">Common Secondary School Subjects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-2">
                                    <p className="font-medium">Compulsory Subjects:</p>
                                    <p className="text-muted-foreground">
                                        English, Kiswahili, Mathematics
                                    </p>
                                    
                                    <p className="font-medium mt-3">Sciences:</p>
                                    <p className="text-muted-foreground">
                                        Biology, Chemistry, Physics
                                    </p>
                                    
                                    <p className="font-medium mt-3">Humanities:</p>
                                    <p className="text-muted-foreground">
                                        History, Geography, CRE/IRE, Business Studies
                                    </p>
                                    
                                    <p className="font-medium mt-3">Languages:</p>
                                    <p className="text-muted-foreground">
                                        French, German, Arabic
                                    </p>
                                    
                                    <p className="font-medium mt-3">Technical:</p>
                                    <p className="text-muted-foreground">
                                        Computer Studies, Agriculture, Home Science, Art & Design
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}