import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

export default function Show({ stream }: { stream: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Grades",
            href: "/grades"
        }
    ]
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Stream: ${stream?.name ?? "Details"}`} />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/grades/${stream.grade?.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{stream.grade?.name} - {stream.name}</h1>
                        <p className="text-muted-foreground">
                            Stream details, class teacher, and enrolled students
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Grade</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-medium">Grade:</span>{" "}
                                {stream.grade?.name ?? "—"}
                            </div>
                            <div>
                                <span className="font-medium">Capacity:</span>{" "}
                                {stream.capacity}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Class Teacher</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {stream.class_teacher ? (
                                <>
                                    <div>
                                        <span className="font-medium">Name:</span>{" "}
                                        {stream.class_teacher.full_name}
                                    </div>
                                </>
                            ) : (
                                <span className="text-muted-foreground">No teacher assigned</span>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stream.students?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {stream.students.map((student: any) => (
                                    <Badge key={student.id} variant="secondary">
                                        {student.full_name}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">No students enrolled</span>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}