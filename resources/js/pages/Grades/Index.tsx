import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Eye, Pencil, School } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ grades }: { grades: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Grades",
            href: "/grades"
        }
    ]
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grades" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Grades & Streams</h2>
                            <p className="text-muted-foreground">Manage grade organization</p>
                        </div>
                        <Button asChild>
                            <Link href="/grades/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Grade
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {grades?.map((grade: any) => (
                            <Card key={grade.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <School className="h-5 w-5 text-primary" />
                                            <CardTitle>{grade.name}</CardTitle>
                                            {grade.education_level && (
                                                <Badge variant="outline">{grade.education_level.name}</Badge>
                                            )}
                                            {grade.has_pathways && (
                                                <Badge variant="secondary">Pathways</Badge>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/grades/${grade.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/grades/${grade.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Capacity:</span>
                                            <span className="font-medium">{grade.capacity} students</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Current Students:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                {grade.students_count || 0}
                                            </span>
                                        </div>

                                        {grade.streams && grade.streams.length > 0 && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Streams:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {grade.streams.map((stream: any) => (
                                                        <Badge key={stream.id} variant="secondary">
                                                            {stream.name}
                                                            {stream.class_teacher && ` • ${stream.class_teacher.full_name}`}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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