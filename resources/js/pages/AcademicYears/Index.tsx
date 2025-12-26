import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Pencil, Trash2, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ auth, academicYears }:{ auth: any; academicYears: any[]}) {
    const handleDelete = ({id, year}: {id: any, year: any}) => {
        if (confirm(`Are you sure you want to delete ${year}?`)) {
            router.delete(`/academic-years/${id}`);
        }
    };

    const setCurrent = (id: number) => {
        router.post(`/academic-years/${id}/set-current`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Academic Years",
            href: "/academic-years"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Academic Years" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Academic Years</h2>
                            <p className="text-muted-foreground">Manage school academic years</p>
                        </div>
                        <Button asChild>
                            <Link href="/academic-years/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Academic Year
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {academicYears?.map((year) => (
                            <Card key={year.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{year.year}</h3>
                                                {year.is_current && (
                                                    <Badge className="bg-green-600">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Current
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>Start Date: {year.start_date}</p>
                                                <p>End Date: {year.end_date}</p>
                                                {year.terms && year.terms.length > 0 && (
                                                    <p>Terms: {year.terms.length}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!year.is_current && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => setCurrent(year.id)}
                                                >
                                                    Set as Current
                                                </Button>
                                            )}
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/academic-years/${year.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/academic-years/${year.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                onClick={() => handleDelete(year.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
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