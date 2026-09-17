import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Index({ grade }: { grade: any }) {
    const handleDelete = (streamId: any, streamName: any) => {
        if (confirm(`Are you sure you want to delete stream ${streamName}?`)) {
            router.delete(`/grades/${grade.id}/streams/${streamId}`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Grades",
            href: "/grades"
        },
        {
            title: grade.name,
            href: `/grades/${grade.id}`
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${grade.name} - Streams`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/grades/${grade.id}`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{grade.name} - Streams</h2>
                                <p className="text-muted-foreground">Manage streams for this grade</p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/grades/${grade.id}/streams/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Stream
                            </Link>
                        </Button>
                    </div>

                    {grade.streams && grade.streams.length > 0 ? (
                        <div className="space-y-3">
                            {grade.streams.map((stream: any) => (
                                <Card key={stream.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {grade.name} - {stream.name}
                                                </h3>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    <p>Capacity: {stream.capacity}</p>
                                                    {stream.class_teacher && (
                                                        <p>Class Teacher: {stream.class_teacher.full_name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/grades/${grade.id}/streams/${stream.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/grades/${grade.id}/streams/${stream.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(stream.id, stream.name)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-8">
                                <p className="text-muted-foreground text-center">No streams added yet</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}