import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function CreateEdit({ pathway }: { pathway?: any }) {
    const isEdit = !!pathway;

    const { data, setData, post, put, processing, errors } = useForm({
        name: pathway?.name || '',
        code: pathway?.code || '',
        description: pathway?.description || '',
        is_active: pathway?.is_active ?? true,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (isEdit) {
            put(`/pathways/${pathway.id}`);
        } else {
            post('/pathways');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Pathways",
            href: "/pathways"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Pathway' : 'Add Pathway'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">
                        {isEdit ? 'Edit Pathway' : 'Add Pathway'}
                    </h2>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                            <CardDescription>e.g. STEM, Social Sciences, Arts & Sports Science</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., STEM"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                {!isEdit && (
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Code <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            placeholder="e.g., STEM"
                                            maxLength={20}
                                        />
                                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                                    <Label htmlFor="is_active">Active</Label>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/pathways">Cancel</Link>
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