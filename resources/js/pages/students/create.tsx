import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Student } from '@/types/student';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';

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
