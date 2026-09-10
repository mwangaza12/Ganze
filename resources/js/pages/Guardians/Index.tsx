import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ guardians, filters }:{ guardians: any, filters: any}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get('/guardians', { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Guardians",
            href: "/Guardians"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guardians" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Parents/Guardians</h2>
                            <p className="text-muted-foreground">Manage parent and guardian information</p>
                        </div>
                        <Button asChild>
                            <Link href="/guardians/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Guardian
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or phone..."
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>ID Number</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guardians.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No guardians found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        guardians.data.map((guardian: any) => (
                                            <TableRow key={guardian.id}>
                                                <TableCell className="font-medium">{guardian.full_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {guardian.relationship}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{guardian.id_number}</TableCell>
                                                <TableCell className="text-muted-foreground">{guardian.phone}</TableCell>
                                                <TableCell className="text-muted-foreground">{guardian.email || '—'}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {guardian.students && guardian.students.length > 0
                                                        ? guardian.students.map((s: any) => s.full_name).join(', ')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/guardians/${guardian.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/guardians/${guardian.id}/edit`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}