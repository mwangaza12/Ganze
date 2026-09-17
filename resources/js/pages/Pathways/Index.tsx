import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Compass } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ pathways }: { pathways: any }) {
    const handleDelete = (id: any, name: any) => {
        if (confirm(`Delete pathway "${name}"?`)) {
            router.delete(`/pathways/${id}`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Pathways",
            href: "/pathways"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pathways" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Senior School Pathways</h2>
                            <p className="text-muted-foreground">STEM, Social Sciences, Arts & Sports Science</p>
                        </div>
                        <Button asChild>
                            <Link href="/pathways/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Pathway
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pathways?.map((pathway: any) => (
                            <Card key={pathway.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Compass className="h-5 w-5 text-primary" />
                                            <div>
                                                <h3 className="font-semibold">{pathway.name}</h3>
                                                <p className="text-sm text-muted-foreground">Code: {pathway.code}</p>
                                            </div>
                                        </div>
                                        {!pathway.is_active && <Badge variant="outline">Inactive</Badge>}
                                    </div>
                                    {pathway.description && (
                                        <p className="text-sm text-muted-foreground mb-3">{pathway.description}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {pathway.student_pathways_count || 0} student(s) on this pathway
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" asChild className="flex-1">
                                            <Link href={`/pathways/${pathway.id}`}>View</Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild className="flex-1">
                                            <Link href={`/pathways/${pathway.id}/edit`}>
                                                <Pencil className="h-3 w-3 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(pathway.id, pathway.name)}
                                        >
                                            <Trash2 className="h-3 w-3 text-destructive" />
                                        </Button>
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