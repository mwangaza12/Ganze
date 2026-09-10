import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ teachers, filters }:{ teachers: any; filters: any; }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get('/teachers', { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: any, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/teachers/${id}`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teachers',
            href: '/teachers',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teachers" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
                            <p className="text-muted-foreground">Manage teaching staff</p>
                        </div>
                        <Button asChild>
                            <Link href="/teachers/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Teacher
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or TSC number..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                        className="pl-9"
                                    />
                                </div>
                                <Button onClick={handleFilter}>Search</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>TSC Number</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Subjects</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teachers.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No teachers found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        teachers.data.map((teacher: any) => (
                                            <TableRow key={teacher.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <span className="text-sm font-semibold text-primary">
                                                                {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium">{teacher.full_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{teacher.tsc_number}</TableCell>
                                                <TableCell className="text-muted-foreground">{teacher.phone}</TableCell>
                                                <TableCell className="text-muted-foreground">{teacher.user?.email || '—'}</TableCell>
                                                <TableCell>
                                                    {teacher.subjects && teacher.subjects.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {teacher.subjects.map((subject: any) => (
                                                                <Badge key={subject.id} variant="outline">
                                                                    {subject.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/teachers/${teacher.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/teachers/${teacher.id}/edit`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher.id, teacher.full_name)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {teachers.links && teachers.links.length > 3 && (
                                <div className="flex justify-between items-center px-6 py-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {teachers.from} to {teachers.to} of {teachers.total} results
                                    </div>
                                    <div className="flex gap-1">
                                        {teachers.links.map((link: any, index: number) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}