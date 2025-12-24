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

export default function GuardianCreateEdit({ auth, guardian, students }) {
    const isEdit = !!guardian;
    
    const { data, setData, post, put, processing, errors } = useForm({
        id_number: guardian?.id_number || '',
        first_name: guardian?.first_name || '',
        middle_name: guardian?.middle_name || '',
        last_name: guardian?.last_name || '',
        phone: guardian?.phone || '',
        alt_phone: guardian?.alt_phone || '',
        email: guardian?.email || '',
        relationship: guardian?.relationship || '',
        occupation: guardian?.occupation || '',
        address: guardian?.address || '',
        student_ids: guardian?.students?.map(s => s.id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/guardians/${guardian.id}`);
        } else {
            post('/guardians');
        }
    };

    const handleStudentToggle = (studentId) => {
        setData('student_ids', 
            data.student_ids.includes(studentId)
                ? data.student_ids.filter(id => id !== studentId)
                : [...data.student_ids, studentId]
        );
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={isEdit ? 'Edit Guardian' : 'Add Guardian'} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/guardians">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Guardian' : 'Add New Guardian'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit ? 'Update guardian information' : 'Enter guardian details'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_number">
                                            ID Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="id_number"
                                            value={data.id_number}
                                            onChange={(e) => setData('id_number', e.target.value)}
                                        />
                                        {errors.id_number && <p className="text-sm text-destructive">{errors.id_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="relationship">
                                            Relationship <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.relationship} onValueChange={(value) => setData('relationship', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select relationship" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="father">Father</SelectItem>
                                                <SelectItem value="mother">Mother</SelectItem>
                                                <SelectItem value="guardian">Guardian</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.relationship && <p className="text-sm text-destructive">{errors.relationship}</p>}
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
                                        <Label htmlFor="occupation">Occupation</Label>
                                        <Input
                                            id="occupation"
                                            value={data.occupation}
                                            onChange={(e) => setData('occupation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Students */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Students</CardTitle>
                                <CardDescription>Link this guardian to students</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {students?.map((student) => (
                                        <div key={student.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`student-${student.id}`}
                                                checked={data.student_ids.includes(student.id)}
                                                onCheckedChange={() => handleStudentToggle(student.id)}
                                            />
                                            <Label htmlFor={`student-${student.id}`} className="font-normal">
                                                {student.full_name} ({student.admission_number})
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex gap-4">
                            <Button type="button" onClick={handleSubmit} disabled={processing}>
                                {processing ? 'Saving...' : (isEdit ? 'Update Guardian' : 'Create Guardian')}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/guardians">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}