import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Eye, Pencil, Phone, Mail } from 'lucide-react';
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

                    <div className="grid gap-4">
                        {guardians.data.map((guardian: any) => (
                            <Card key={guardian.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{guardian.full_name}</h3>
                                                <Badge variant="outline" className="capitalize">
                                                    {guardian.relationship}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>ID: {guardian.id_number}</span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {guardian.phone}
                                                </span>
                                                {guardian.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {guardian.email}
                                                    </span>
                                                )}
                                            </div>
                                            {guardian.students && guardian.students.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Students: {guardian.students.map((s: any )=> s.full_name).join(', ')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/guardians/${guardian.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/guardians/${guardian.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
