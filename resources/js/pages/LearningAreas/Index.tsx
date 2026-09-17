import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, BookOpen, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ learningAreas }: { learningAreas: any }) {
    const handleDelete = (id: any, name: any) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/learning-areas/${id}`);
        }
    };

    const getCategoryBadge = (category: any) => {
        const badges: any = {
            core: { variant: 'default', label: 'Core' },
            optional: { variant: 'outline', label: 'Optional' },
        };
        return badges[category] || badges.core;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Learning Areas",
            href: "/learning-areas",
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Learning Areas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Learning Areas</h2>
                            <p className="text-muted-foreground">Manage the school's learning areas</p>
                        </div>
                        <Button asChild>
                            <Link href="/learning-areas/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Learning Area
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {learningAreas?.map((learningArea: any) => {
                            const categoryBadge = getCategoryBadge(learningArea.category);
                            return (
                                <Card key={learningArea.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                                <div>
                                                    <h3 className="font-semibold">{learningArea.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Code: {learningArea.code}</p>
                                                </div>
                                            </div>
                                            <Badge variant={categoryBadge.variant}>{categoryBadge.label}</Badge>
                                        </div>

                                        {learningArea.teachers && learningArea.teachers.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-sm text-muted-foreground mb-1">Teachers:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {learningArea.teachers.map((teacher: any) => (
                                                        <Badge key={teacher.id} variant="outline" className="text-xs">
                                                            {teacher.full_name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-4">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <Link href={`/learning-areas/${learningArea.id}`}>
                                                    View
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <Link href={`/learning-areas/${learningArea.id}/edit`}>
                                                    <Pencil className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(learningArea.id, learningArea.name)}
                                                className="flex-1"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1 text-destructive" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}