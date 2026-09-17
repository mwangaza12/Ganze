import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Show({ pathway }: { pathway: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Pathways",
            href: "/pathways"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pathway.name} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/pathways">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{pathway.name}</h2>
                                <p className="text-muted-foreground">{pathway.description}</p>
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/pathways/${pathway.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Areas Assigned to This Pathway</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pathway.grade_learning_areas && pathway.grade_learning_areas.length > 0 ? (
                                <div className="space-y-2">
                                    {pathway.grade_learning_areas.map((gla: any) => (
                                        <div key={gla.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{gla.learning_area?.name}</p>
                                                <p className="text-sm text-muted-foreground">{gla.grade?.name}</p>
                                            </div>
                                            <Badge variant="outline">{gla.grade?.name}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">
                                    No learning areas assigned to this pathway yet — assign them from a grade's page.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}