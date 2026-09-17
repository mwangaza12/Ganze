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

export default function LearningAreaCreateEdit({ learningArea }: { learningArea?: any }) {
    const isEdit = !!learningArea;

    const { data, setData, post, put, processing, errors } = useForm({
        name: learningArea?.name || '',
        code: learningArea?.code || '',
        category: learningArea?.category || '',
        is_active: learningArea?.is_active ?? true,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (isEdit) {
            put(`/learning-areas/${learningArea.id}`);
        } else {
            post('/learning-areas');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Learning Areas",
            href: "/learning-areas"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Learning Area' : 'Add Learning Area'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Learning Area' : 'Add New Learning Area'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update learning area information' : 'Create a new learning area'}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Area Details</CardTitle>
                            <CardDescription>Enter the learning area information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Mathematics, English, Kiswahili"
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
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            placeholder="e.g., MATH, ENG, KIS"
                                            maxLength={20}
                                        />
                                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                        <p className="text-sm text-muted-foreground">
                                            A short unique code — can't be changed after creation.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="core">Core</SelectItem>
                                            <SelectItem value="optional">Optional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Core learning areas are compulsory; optional ones are typically tied to a Senior School pathway.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_active">Active Status</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enable or disable this learning area
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
                                        {processing ? 'Saving...' : (isEdit ? 'Update Learning Area' : 'Create Learning Area')}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/learning-areas">Cancel</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!isEdit && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-base">CBC Learning Area Reference</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-2">
                                    <p className="font-medium">Junior School core learning areas:</p>
                                    <p className="text-muted-foreground">
                                        English, Kiswahili/KSL, Mathematics, Integrated Science, Social Studies,
                                        Agriculture & Nutrition, Pre-Technical Studies, Christian/Islamic/Hindu
                                        Religious Education, Creative Arts & Sports
                                    </p>

                                    <p className="font-medium mt-3">Senior School pathways:</p>
                                    <p className="text-muted-foreground">
                                        STEM, Social Sciences, Arts & Sports Science — each pathway carries its own
                                        set of compulsory and optional learning areas, assigned per grade under
                                        Grades → Learning Areas.
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