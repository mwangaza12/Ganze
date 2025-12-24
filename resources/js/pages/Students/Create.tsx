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

export default function CreateEdit({ auth, student, classes, streams }) {
    const isEdit = !!student;
    
    const { data, setData, post, put, processing, errors } = useForm({
        admission_number: student?.admission_number || '',
        first_name: student?.first_name || '',
        middle_name: student?.middle_name || '',
        last_name: student?.last_name || '',
        gender: student?.gender || '',
        date_of_birth: student?.date_of_birth || '',
        admission_date: student?.admission_date || '',
        class_id: student?.class_id?.toString() || '',
        stream_id: student?.stream_id?.toString() || '',
        birth_certificate_number: student?.birth_certificate_number || '',
        medical_conditions: student?.medical_conditions || '',
        allergies: student?.allergies || '',
        address: student?.address || '',
        county: student?.county || '',
        sub_county: student?.sub_county || '',
        email: student?.user?.email || '',
        phone: student?.user?.phone || '',
        status: student?.status || 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/students/${student.id}`);
        } else {
            post('/students');
        }
    };

    const counties = [
        'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa', 
        'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 
        'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 
        'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 
        'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 
        'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 
        'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
    ];

    return (
        <AppLayout user={auth.user}>
            <Head title={isEdit ? 'Edit Student' : 'Add Student'} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/students">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Student' : 'Add New Student'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update student information' : 'Enter student details to create new record'}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Basic student details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Admission Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admission_number">
                                            Admission Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="admission_number"
                                            value={data.admission_number}
                                            onChange={(e) => setData('admission_number', e.target.value)}
                                            placeholder="e.g., 2024001"
                                            required
                                        />
                                        {errors.admission_number && (
                                            <p className="text-sm text-destructive">{errors.admission_number}</p>
                                        )}
                                    </div>

                                    {/* First Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">
                                            First Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="Enter first name"
                                            required
                                        />
                                        {errors.first_name && (
                                            <p className="text-sm text-destructive">{errors.first_name}</p>
                                        )}
                                    </div>

                                    {/* Middle Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="middle_name">Middle Name</Label>
                                        <Input
                                            id="middle_name"
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                            placeholder="Enter middle name"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">
                                            Last Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="Enter last name"
                                            required
                                        />
                                        {errors.last_name && (
                                            <p className="text-sm text-destructive">{errors.last_name}</p>
                                        )}
                                    </div>

                                    {/* Gender */}
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
                                        {errors.gender && (
                                            <p className="text-sm text-destructive">{errors.gender}</p>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">
                                            Date of Birth <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            required
                                        />
                                        {errors.date_of_birth && (
                                            <p className="text-sm text-destructive">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    {/* Birth Certificate Number */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="birth_certificate_number">Birth Certificate Number</Label>
                                        <Input
                                            id="birth_certificate_number"
                                            value={data.birth_certificate_number}
                                            onChange={(e) => setData('birth_certificate_number', e.target.value)}
                                            placeholder="Enter birth certificate number"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Academic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Academic Information</CardTitle>
                                <CardDescription>Class and academic details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Admission Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admission_date">
                                            Admission Date <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="admission_date"
                                            type="date"
                                            value={data.admission_date}
                                            onChange={(e) => setData('admission_date', e.target.value)}
                                            required
                                        />
                                        {errors.admission_date && (
                                            <p className="text-sm text-destructive">{errors.admission_date}</p>
                                        )}
                                    </div>

                                    {/* Class */}
                                    <div className="space-y-2">
                                        <Label htmlFor="class_id">
                                            Class <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.class_id} onValueChange={(value) => setData('class_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes?.map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.class_id && (
                                            <p className="text-sm text-destructive">{errors.class_id}</p>
                                        )}
                                    </div>

                                    {/* Stream */}
                                    <div className="space-y-2">
                                        <Label htmlFor="stream_id">Stream</Label>
                                        <Select 
                                            value={data.stream_id} 
                                            onValueChange={(value) => setData('stream_id', value)}
                                            disabled={!data.class_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select stream" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {streams?.filter(s => s.class_id.toString() === data.class_id).map((stream) => (
                                                    <SelectItem key={stream.id} value={stream.id.toString()}>
                                                        {stream.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status (only for edit) */}
                                    {isEdit && (
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="transferred">Transferred</SelectItem>
                                                    <SelectItem value="graduated">Graduated</SelectItem>
                                                    <SelectItem value="expelled">Expelled</SelectItem>
                                                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact & Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Location Information</CardTitle>
                                <CardDescription>Address and contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="student@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+254 700 000 000"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* County */}
                                    <div className="space-y-2">
                                        <Label htmlFor="county">County</Label>
                                        <Select value={data.county} onValueChange={(value) => setData('county', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select county" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {counties.map((county) => (
                                                    <SelectItem key={county} value={county}>
                                                        {county}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sub County */}
                                    <div className="space-y-2">
                                        <Label htmlFor="sub_county">Sub County</Label>
                                        <Input
                                            id="sub_county"
                                            value={data.sub_county}
                                            onChange={(e) => setData('sub_county', e.target.value)}
                                            placeholder="Enter sub county"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Physical Address</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Enter physical address"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Medical Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Medical Information</CardTitle>
                                <CardDescription>Health-related information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Medical Conditions */}
                                    <div className="space-y-2">
                                        <Label htmlFor="medical_conditions">Medical Conditions</Label>
                                        <Textarea
                                            id="medical_conditions"
                                            value={data.medical_conditions}
                                            onChange={(e) => setData('medical_conditions', e.target.value)}
                                            placeholder="List any medical conditions"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Allergies */}
                                    <div className="space-y-2">
                                        <Label htmlFor="allergies">Allergies</Label>
                                        <Textarea
                                            id="allergies"
                                            value={data.allergies}
                                            onChange={(e) => setData('allergies', e.target.value)}
                                            placeholder="List any allergies"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex gap-4">
                            <Button type="button" onClick={handleSubmit} disabled={processing}>
                                {processing ? 'Saving...' : (isEdit ? 'Update Student' : 'Create Student')}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/students">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}