import { Button } from '@/components/ui/button';
import { Card, CardTitle,CardContent,CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select,SelectValue, SelectContent, SelectGroup, SelectItem,SelectTrigger  } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enroll Student',
        href: '/students/create'
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div>
                <Form method='post' action='/students'>
                    <Card>
                        <CardTitle>Enroll Students</CardTitle>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="Name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Joseph Mwangaza"
                                        required
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input id="date_of_birth" type="date" required name='date_of_birth' />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="parent_name">Parent Name</Label>
                                    <Input id="parent_name" type="text" required name='parent_name' />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="parent_email">Parent Email</Label>
                                    <Input id="parent_email" type="email" required name='parent_email' />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="parent_contact">Parent Contact</Label>
                                    <Input id="parent_contact" type="text" required name='parent_contact' />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="previous_school">Previous School</Label>
                                    <Input id="previous_school" type="text" required name='previous_school' />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="kcpe_marks">KCPE Marks</Label>
                                    <Input id="kcpe_marks" type="number" required name='kcpe_marks' />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="form">Form</Label>
                                    <Select name='form'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Form" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="1E">1E</SelectItem>
                                                <SelectItem value="2E">2E</SelectItem>
                                                <SelectItem value="3E">3E</SelectItem>
                                                <SelectItem value="4E">4E</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full">
                                Enroll
                            </Button>
                        </CardFooter>
                    </Card>

                </Form>
            </div>
        </AppLayout>
    );
}
