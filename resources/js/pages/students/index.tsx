import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students'
    },
];

interface Student {
    id: number,
    name: string,
    email: string
}

export default function Index({ students }: { students: Student[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div>
                {students.map((s:Student)=> (
                    <div key={s.id}>
                        <p>{s.name} - {s.email}</p>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
