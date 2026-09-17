import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function CreateEdit({ educationLevel }: { educationLevel?: any }) {
    const isEdit = !!educationLevel;

    const { data, setData, post, put, processing, errors } = useForm({
        name: educationLevel?.name || '',
        code: educationLevel?.code || '',
        sequence: educationLevel?.sequence?.toString() || '0',
        is_active: educationLevel?.is_active ?? true,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (isEdit) {
            put(`/education-levels/${educationLevel.id}`);
        } else {
            post('/education-levels');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Education Levels",
            href: "/education-levels"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Education Level' : 'Add Education Level'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">
                        {isEdit ? 'Edit Education Level' : 'Add Education Level'}
                    </h2>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                            <CardDescription>e.g. Junior School, Senior School</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Junior School"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Code <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g., JSS"
                                        maxLength={20}
                                    />
                                    {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sequence">Order</Label>
                                    <Input
                                        id="sequence"
                                        type="number"
                                        min="0"
                                        value={data.sequence}
                                        onChange={(e) => setData('sequence', e.target.value)}
                                    />
                                    {errors.sequence && <p className="text-sm text-destructive">{errors.sequence}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Controls display order (e.g. Pre-Primary = 1, Junior School = 4, Senior School = 5)
                                    </p>
                                </div>

                                <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
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
                                        <Link href="/education-levels">Cancel</Link>
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