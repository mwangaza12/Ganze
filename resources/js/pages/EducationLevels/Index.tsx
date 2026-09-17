import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Layers } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ educationLevels }: { educationLevels: any }) {
    const handleDelete = (id: any, name: any) => {
        if (confirm(`Delete education level "${name}"? Grades under it must be removed first.`)) {
            router.delete(`/education-levels/${id}`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Education Levels",
            href: "/education-levels"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Education Levels" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Education Levels</h2>
                            <p className="text-muted-foreground">
                                e.g. Pre-Primary, Lower Primary, Junior School, Senior School
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/education-levels/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Level
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {educationLevels?.map((level: any) => (
                            <Card key={level.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Layers className="h-5 w-5 text-primary" />
                                            <div>
                                                <h3 className="font-semibold">{level.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Code: {level.code} • {level.grades_count || 0} grade(s)
                                                </p>
                                            </div>
                                            {!level.is_active && <Badge variant="outline">Inactive</Badge>}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/education-levels/${level.id}`}>View</Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/education-levels/${level.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(level.id, level.name)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {(!educationLevels || educationLevels.length === 0) && (
                            <Card>
                                <CardContent className="py-8">
                                    <p className="text-muted-foreground text-center">No education levels yet</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}