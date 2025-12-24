import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function CreateEdit({ auth, teacher, subjects }) {
    const isEdit = !!teacher;
    
    const { data, setData, post, put, processing, errors } = useForm({
        tsc_number: teacher?.tsc_number || '',
        id_number: teacher?.id_number || '',
        first_name: teacher?.first_name || '',
        middle_name: teacher?.middle_name || '',
        last_name: teacher?.last_name || '',
        gender: teacher?.gender || '',
        date_of_birth: teacher?.date_of_birth || '',
        date_of_employment: teacher?.date_of_employment || '',
        qualification: teacher?.qualification || '',
        phone: teacher?.phone || '',
        alt_phone: teacher?.alt_phone || '',
        address: teacher?.address || '',
        emergency_contact: teacher?.emergency_contact || '',
        emergency_contact_name: teacher?.emergency_contact_name || '',
        email: teacher?.user?.email || '',
        subject_ids: teacher?.subjects?.map(s => s.id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/teachers/${teacher.id}`);
        } else {
            post('/teachers');
        }
    };

    const handleSubjectToggle = (subjectId) => {
        setData('subject_ids', 
            data.subject_ids.includes(subjectId)
                ? data.subject_ids.filter(id => id !== subjectId)
                : [...data.subject_ids, subjectId]
        );
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={isEdit ? 'Edit Teacher' : 'Add Teacher'} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/teachers">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Teacher' : 'Add New Teacher'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update teacher information' : 'Enter teacher details'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Basic teacher details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tsc_number">
                                            TSC Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="tsc_number"
                                            value={data.tsc_number}
                                            onChange={(e) => setData('tsc_number', e.target.value)}
                                            placeholder="e.g., 12345678"
                                        />
                                        {errors.tsc_number && <p className="text-sm text-destructive">{errors.tsc_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="id_number">
                                            ID Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="id_number"
                                            value={data.id_number}
                                            onChange={(e) => setData('id_number', e.target.value)}
                                            placeholder="National ID"
                                        />
                                        {errors.id_number && <p className="text-sm text-destructive">{errors.id_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">
                                            First Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                        />
                                        {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="middle_name">Middle Name</Label>
                                        <Input
                                            id="middle_name"
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">
                                            Last Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                        />
                                        {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">
                                            Gender <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">
                                            Date of Birth <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                        />
                                        {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_employment">
                                            Employment Date <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="date_of_employment"
                                            type="date"
                                            value={data.date_of_employment}
                                            onChange={(e) => setData('date_of_employment', e.target.value)}
                                        />
                                        {errors.date_of_employment && <p className="text-sm text-destructive">{errors.date_of_employment}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact & Qualification */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Qualification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Phone <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="alt_phone">Alternative Phone</Label>
                                        <Input
                                            id="alt_phone"
                                            value={data.alt_phone}
                                            onChange={(e) => setData('alt_phone', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="qualification">
                                            Qualification <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="qualification"
                                            value={data.qualification}
                                            onChange={(e) => setData('qualification', e.target.value)}
                                            placeholder="e.g., B.Ed, M.Sc"
                                        />
                                        {errors.qualification && <p className="text-sm text-destructive">{errors.qualification}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Emergency Contact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="emergency_contact_name">
                                            Contact Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="emergency_contact_name"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        />
                                        {errors.emergency_contact_name && <p className="text-sm text-destructive">{errors.emergency_contact_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="emergency_contact">
                                            Contact Phone <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="emergency_contact"
                                            value={data.emergency_contact}
                                            onChange={(e) => setData('emergency_contact', e.target.value)}
                                        />
                                        {errors.emergency_contact && <p className="text-sm text-destructive">{errors.emergency_contact}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Subjects */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Subjects</CardTitle>
                                <CardDescription>Select subjects this teacher can teach</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {subjects?.map((subject) => (
                                        <div key={subject.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`subject-${subject.id}`}
                                                checked={data.subject_ids.includes(subject.id)}
                                                onCheckedChange={() => handleSubjectToggle(subject.id)}
                                            />
                                            <Label htmlFor={`subject-${subject.id}`} className="font-normal">
                                                {subject.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex gap-4">
                            <Button type="button" onClick={handleSubmit} disabled={processing}>
                                {processing ? 'Saving...' : (isEdit ? 'Update Teacher' : 'Create Teacher')}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/teachers">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}