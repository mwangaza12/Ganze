import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateEdit({ auth, term, academicYears }) {
    const isEdit = !!term;
    
    const { data, setData, post, put, processing, errors } = useForm({
        academic_year_id: term?.academic_year_id?.toString() || '',
        term_number: term?.term_number?.toString() || '',
        name: term?.name || '',
        start_date: term?.start_date || '',
        end_date: term?.end_date || '',
        is_current: term?.is_current || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/terms/${term.id}`);
        } else {
            post('/terms');
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={isEdit ? 'Edit Term' : 'Add Term'} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/terms">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Term' : 'Add Term'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update term details' : 'Create a new term'}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Term Details</CardTitle>
                            <CardDescription>Enter the term information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="academic_year_id">
                                    Academic Year <span className="text-destructive">*</span>
                                </Label>
                                <Select value={data.academic_year_id} onValueChange={(value) => setData('academic_year_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select academic year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYears?.map((year) => (
                                            <SelectItem key={year.id} value={year.id.toString()}>
                                                {year.year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.academic_year_id && <p className="text-sm text-destructive">{errors.academic_year_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="term_number">
                                        Term Number <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.term_number} onValueChange={(value) => setData('term_number', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select term" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Term 1</SelectItem>
                                            <SelectItem value="2">Term 2</SelectItem>
                                            <SelectItem value="3">Term 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.term_number && <p className="text-sm text-destructive">{errors.term_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Term Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Term 1"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
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
                                    Set as current term
                                </Label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/terms">Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}