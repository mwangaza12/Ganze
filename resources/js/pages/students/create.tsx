import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
                Student Enrollment Form Coming Soon...
            </div>
        </AppLayout>
    );
}
