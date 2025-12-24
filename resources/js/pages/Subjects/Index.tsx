import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, BookOpen, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ auth, subjects }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/subjects/${id}`);
        }
    };

    const getCategoryBadge = (category) => {
        const badges = {
            compulsory: { variant: 'default', label: 'Compulsory' },
            science: { variant: 'secondary', label: 'Science' },
            humanities: { variant: 'outline', label: 'Humanities' },
            technical: { variant: 'secondary', label: 'Technical' },
            language: { variant: 'outline', label: 'Language' },
        };
        return badges[category] || badges.compulsory;
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Subjects" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
                            <p className="text-muted-foreground">Manage school subjects</p>
                        </div>
                        <Button asChild>
                            <Link href="/subjects/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Subject
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {subjects?.map((subject) => {
                            const categoryBadge = getCategoryBadge(subject.category);
                            return (
                                <Card key={subject.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                                <div>
                                                    <h3 className="font-semibold">{subject.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Code: {subject.code}</p>
                                                </div>
                                            </div>
                                            <Badge variant={categoryBadge.variant}>{categoryBadge.label}</Badge>
                                        </div>

                                        {subject.teachers && subject.teachers.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-sm text-muted-foreground mb-1">Teachers:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {subject.teachers.map((teacher) => (
                                                        <Badge key={teacher.id} variant="outline" className="text-xs">
                                                            {teacher.full_name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-4">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <Link href={`/subjects/${subject.id}/edit`}>
                                                    <Pencil className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(subject.id, subject.name)}
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