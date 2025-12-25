import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, Plus, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Show({ auth, academicYear }) {
    return (
        <AppLayout user={auth.user}>
            <Head title={`Academic Year - ${academicYear.year}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/academic-years">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-3xl font-bold tracking-tight">{academicYear.year}</h2>
                                    {academicYear.is_current && (
                                        <Badge className="bg-green-600">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Current
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground">
                                    {academicYear.start_date} to {academicYear.end_date}
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/academic-years/${academicYear.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Terms</CardTitle>
                                <Button size="sm" asChild>
                                    <Link href={`/academic-years/${academicYear.id}/terms/create`}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Term
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {academicYear.terms && academicYear.terms.length > 0 ? (
                                    <div className="space-y-3">
                                        {academicYear.terms.map((term) => (
                                            <div key={term.id} className="flex justify-between items-center p-4 border rounded-lg">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{term.name}</p>
                                                        {term.is_current && (
                                                            <Badge variant="secondary">Current</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {term.start_date} to {term.end_date}
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/terms/${term.id}/edit`}>Edit</Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No terms created yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}