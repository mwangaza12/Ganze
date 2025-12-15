import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Student } from '@/types/student';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students'
    },
];


export default function Index({ students }: { students: Student[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="flex justify-between px-4 mt-4">
                <h1>Student Management</h1>
                <Button><Link href="/students/create">Enroll Student</Link></Button>
            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={students} />
            </div>
        </AppLayout>
    );
}
