import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardContent, CardFooter, CardHeader, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectValue, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { UserPlus, User, Calendar, Users, Mail, Phone, School, Award, GraduationCap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students'
    },
    {
        title: 'Enroll Student',
        href: '/students/create'
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enroll Student" />
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Enroll New Student</h2>
                    <p className="text-muted-foreground">
                        Add a new student to the system
                    </p>
                </div>

                <Form method='post' action='/students'>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Student Information Card */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Student Information
                                </CardTitle>
                                <CardDescription>
                                    Basic details about the student
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Joseph Mwangaza"
                                        required
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Date of Birth
                                    </Label>
                                    <Input id="date_of_birth" type="date" required name='date_of_birth' />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Academic Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Academic Details
                                </CardTitle>
                                <CardDescription>
                                    Previous school and performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="previous_school" className="flex items-center gap-2">
                                        <School className="h-4 w-4" />
                                        Previous School
                                    </Label>
                                    <Input id="previous_school" type="text" required name='previous_school' placeholder='Sunshine Primary'/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="kcpe_marks" className="flex items-center gap-2">
                                        <Award className="h-4 w-4" />
                                        KCPE Marks
                                    </Label>
                                    <Input id="kcpe_marks" type="number" required name='kcpe_marks' placeholder="350" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="form">Assign Form</Label>
                                    <Select name='form'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Form" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="1E">Form 1E</SelectItem>
                                                <SelectItem value="2E">Form 2E</SelectItem>
                                                <SelectItem value="3E">Form 3E</SelectItem>
                                                <SelectItem value="4E">Form 4E</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Parent/Guardian Information Card */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Parent/Guardian Information
                                </CardTitle>
                                <CardDescription>
                                    Contact details for the student's parent or guardian
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="parent_name">Parent/Guardian Name</Label>
                                        <Input id="parent_name" type="text" required name='parent_name' placeholder="John Mwangaza" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="parent_contact" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Contact Number
                                        </Label>
                                        <Input id="parent_contact" type="text" required name='parent_contact' placeholder="+254 712 345 678" />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="parent_email" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </Label>
                                        <Input id="parent_email" type="email" required name='parent_email' placeholder="john.mwangaza@example.com" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button type="submit" className="w-full md:w-auto">
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Enroll Student
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}