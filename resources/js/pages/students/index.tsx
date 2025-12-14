import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Student } from '@/types/student';
import { Head } from '@inertiajs/react';
import { DataTable } from './data-table';
import { columns } from './columns';

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
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={students} />
            </div>
        </AppLayout>
    );
}
