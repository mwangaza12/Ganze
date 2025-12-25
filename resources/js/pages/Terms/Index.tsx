import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ auth, terms, academicYears }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/terms/${id}`);
        }
    };

    const setCurrent = (id) => {
        router.post(`/terms/${id}/set-current`);
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Terms" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Terms</h2>
                            <p className="text-muted-foreground">Manage school terms</p>
                        </div>
                        <Button asChild>
                            <Link href="/terms/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Term
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {terms?.map((term) => (
                            <Card key={term.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{term.name}</h3>
                                                {term.is_current && (
                                                    <Badge className="bg-green-600">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Current
                                                    </Badge>
                                                )}
                                                <Badge variant="outline">
                                                    {term.academic_year?.year}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                <p>{term.start_date} to {term.end_date}</p>
                                                <p className="mt-1">Term {term.term_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!term.is_current && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => setCurrent(term.id)}
                                                >
                                                    Set as Current
                                                </Button>
                                            )}
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/terms/${term.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                onClick={() => handleDelete(term.id, term.name)}
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