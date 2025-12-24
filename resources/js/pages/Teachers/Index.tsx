import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Eye, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ auth, teachers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get('/teachers', { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/teachers/${id}`);
        }
    };

    return (
        <AppLayout user={auth.user}>
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

                    <div className="grid gap-4">
                        {teachers.data.map((teacher) => (
                            <Card key={teacher.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-lg font-semibold text-primary">
                                                    {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{teacher.full_name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                    <span>TSC: {teacher.tsc_number}</span>
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {teacher.phone}
                                                    </span>
                                                    {teacher.user?.email && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {teacher.user.email}
                                                        </span>
                                                    )}
                                                </div>
                                                {teacher.subjects && teacher.subjects.length > 0 && (
                                                    <div className="flex gap-1 mt-2">
                                                        {teacher.subjects.map((subject) => (
                                                            <Badge key={subject.id} variant="outline">
                                                                {subject.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/teachers/${teacher.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/teachers/${teacher.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => handleDelete(teacher.id, teacher.full_name)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {teachers.links && teachers.links.length > 3 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {teachers.from} to {teachers.to} of {teachers.total} results
                            </div>
                            <div className="flex gap-1">
                                {teachers.links.map((link, index) => (
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
                </div>
            </div>
        </AppLayout>
    );
}
