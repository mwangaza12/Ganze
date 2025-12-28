import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Create({ academicYears, terms, classes }: {academicYears: any, terms: any, classes: any}) {
    const { data, setData, post, processing, errors } = useForm({
        academic_year_id: '',
        term_id: '',
        class_id: '',
        fee_type: '',
        amount: '',
        description: '',
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post('/fees');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Fees",
            href: "/feed"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Fee Structure" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/fees">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Add Fee Structure</h2>
                            <p className="text-muted-foreground">Create a new fee structure</p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Structure Details</CardTitle>
                            <CardDescription>Enter the fee information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="academic_year_id">
                                            Academic Year <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.academic_year_id} onValueChange={(value) => setData('academic_year_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select academic year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYears?.map((year: any) => (
                                                    <SelectItem key={year.id} value={year.id.toString()}>
                                                        {year.year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.academic_year_id && <p className="text-sm text-destructive">{errors.academic_year_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="term_id">
                                            Term <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.term_id} onValueChange={(value) => setData('term_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select term" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {terms?.map((term: any) => (
                                                    <SelectItem key={term.id} value={term.id.toString()}>
                                                        {term.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.term_id && <p className="text-sm text-destructive">{errors.term_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="class_id">
                                            Class <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.class_id} onValueChange={(value) => setData('class_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes?.map((cls: any) => (
                                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.class_id && <p className="text-sm text-destructive">{errors.class_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fee_type">
                                            Fee Type <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.fee_type} onValueChange={(value) => setData('fee_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select fee type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Tuition">Tuition</SelectItem>
                                                <SelectItem value="Activity">Activity Fee</SelectItem>
                                                <SelectItem value="Exam">Exam Fee</SelectItem>
                                                <SelectItem value="Boarding">Boarding Fee</SelectItem>
                                                <SelectItem value="Transport">Transport Fee</SelectItem>
                                                <SelectItem value="Lunch">Lunch Fee</SelectItem>
                                                <SelectItem value="Development">Development Fee</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.fee_type && <p className="text-sm text-destructive">{errors.fee_type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">
                                            Amount (KSh) <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Additional details about the fee"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Fee Structure'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/fees">Cancel</Link>
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