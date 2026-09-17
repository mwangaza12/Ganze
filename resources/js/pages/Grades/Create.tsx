import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function CreateEdit({ grade, educationLevels }: { grade?: any, educationLevels: any }) {
    const isEdit = !!grade;

    const { data, setData, post, put, processing, errors } = useForm({
        education_level_id: grade?.education_level_id?.toString() || '',
        name: grade?.name || '',
        code: grade?.code || '',
        sequence: grade?.sequence?.toString() || '0',
        capacity: grade?.capacity?.toString() || '40',
        has_pathways: grade?.has_pathways || false,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (isEdit) {
            put(`/grades/${grade.id}`);
        } else {
            post('/grades');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Grades",
            href: "/grades"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Grade' : 'Add Grade'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Grade' : 'Add New Grade'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update grade information' : 'Create a new grade'}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Grade Details</CardTitle>
                            <CardDescription>Enter the grade information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="education_level_id">
                                        Education Level <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.education_level_id}
                                        onValueChange={(value) => setData('education_level_id', value)}
                                        disabled={isEdit}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {educationLevels?.map((level: any) => (
                                                <SelectItem key={level.id} value={level.id.toString()}>
                                                    {level.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.education_level_id && <p className="text-sm text-destructive">{errors.education_level_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Grade Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Grade 7, Grade 10"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                {!isEdit && (
                                    <div className="space-y-2">
                                        <Label htmlFor="code">
                                            Code <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="e.g., G7, G10"
                                        />
                                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                        <p className="text-sm text-muted-foreground">
                                            A short unique code — can't be changed after creation.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="sequence">
                                        Order
                                    </Label>
                                    <Input
                                        id="sequence"
                                        type="number"
                                        min="0"
                                        value={data.sequence}
                                        onChange={(e) => setData('sequence', e.target.value)}
                                    />
                                    {errors.sequence && <p className="text-sm text-destructive">{errors.sequence}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Controls display order across all grades (e.g. PP1 = 1 ... Grade 12 = 14)
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
                                        Maximum number of students in this grade
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="has_pathways"
                                        checked={data.has_pathways}
                                        onCheckedChange={(checked) => setData('has_pathways', !!checked)}
                                    />
                                    <Label htmlFor="has_pathways" className="font-normal">
                                        Uses Senior School pathways (STEM / Social Sciences / Arts & Sports Science)
                                    </Label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Saving...' : (isEdit ? 'Update Grade' : 'Create Grade')}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/grades">Cancel</Link>
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