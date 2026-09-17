import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Show({ educationLevel }: { educationLevel: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Education Levels",
            href: "/education-levels"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={educationLevel.name} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/education-levels">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h2 className="text-3xl font-bold tracking-tight">{educationLevel.name}</h2>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/education-levels/${educationLevel.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Grades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {educationLevel.grades && educationLevel.grades.length > 0 ? (
                                <div className="space-y-2">
                                    {educationLevel.grades.map((grade: any) => (
                                        <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <span className="font-medium">{grade.name}</span>
                                            <Link href={`/grades/${grade.id}`} className="text-sm text-primary hover:underline">
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No grades under this level yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}