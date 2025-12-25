import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
export default function CreateEdit({ auth, academicYear }) {
    const isEdit = !!academicYear;
    
    const { data, setData, post, put, processing, errors } = useForm({
        year: academicYear?.year || '',
        start_date: academicYear?.start_date || '',
        end_date: academicYear?.end_date || '',
        is_current: academicYear?.is_current || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/academic-years/${academicYear.id}`);
        } else {
            post('/academic-years');
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={isEdit ? 'Edit Academic Year' : 'Add Academic Year'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/academic-years">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Academic Year' : 'Add Academic Year'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update academic year details' : 'Create a new academic year'}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Year Details</CardTitle>
                            <CardDescription>Enter the academic year information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">
                                    Academic Year <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="year"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    placeholder="e.g., 2024/2025"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Format: YYYY/YYYY (e.g., 2024/2025)
                                </p>
                                {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">
                                        Start Date <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">
                                        End Date <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_current"
                                    checked={data.is_current}
                                    onCheckedChange={(checked) => setData('is_current', checked)}
                                />
                                <Label htmlFor="is_current" className="font-normal">
                                    Set as current academic year
                                </Label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/academic-years">Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}