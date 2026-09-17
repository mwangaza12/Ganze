import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Pencil, Users, BookOpen, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Show({ grade }: { grade: any }) {
    const handleDeleteStream = (streamId: any, streamName: any) => {
        if (confirm(`Are you sure you want to delete stream ${streamName}?`)) {
            router.delete(`/grades/${grade.id}/streams/${streamId}`);
        }
    };

    const handleUnassignLearningArea = (gradeLearningAreaId: any, name: any) => {
        if (confirm(`Remove ${name} from this grade?`)) {
            router.delete(`/grades/${grade.id}/learning-areas/${gradeLearningAreaId}/unassign`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Grade",
            href: "/grades"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Grade - ${grade.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/grades">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{grade.name}</h2>
                                <p className="text-muted-foreground">
                                    {grade.education_level?.name}
                                    {grade.has_pathways && ' • Uses pathways'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`/grades/${grade.id}/streams/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Stream
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/grades/${grade.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Grade
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{grade.students?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">out of {grade.capacity}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Streams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{grade.streams?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">active streams</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Learning Areas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{grade.learning_areas?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">assigned learning areas</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="streams" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="streams">
                                <Users className="mr-2 h-4 w-4" />
                                Streams
                            </TabsTrigger>
                            <TabsTrigger value="students">
                                <Users className="mr-2 h-4 w-4" />
                                Students
                            </TabsTrigger>
                            <TabsTrigger value="learning-areas">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Learning Areas
                            </TabsTrigger>
                        </TabsList>

                        {/* Streams Tab */}
                        <TabsContent value="streams">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Streams</CardTitle>
                                        <Button size="sm" asChild>
                                            <Link href={`/grades/${grade.id}/streams/create`}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Stream
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {grade.streams && grade.streams.length > 0 ? (
                                        <div className="space-y-3">
                                            {grade.streams.map((stream: any) => (
                                                <Card key={stream.id}>
                                                    <CardContent className="pt-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-lg">
                                                                    {grade.name} - {stream.name}
                                                                </h3>
                                                                <div className="text-sm text-muted-foreground mt-1">
                                                                    <p>Capacity: {stream.capacity}</p>
                                                                    {stream.classTeacher && (
                                                                        <p>Class Teacher: {stream.classTeacher.full_name}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" asChild>
                                                                    <Link href={`/grades/${grade.id}/streams/${stream.id}/edit`}>
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteStream(stream.id, stream.name)}
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
                                        <p className="text-muted-foreground text-center py-8">
                                            No streams added yet
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Students Tab */}
                        <TabsContent value="students">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Students in {grade.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {grade.students && grade.students.length > 0 ? (
                                        <div className="space-y-2">
                                            {grade.students.map((student: any) => (
                                                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{student.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {student.admission_number}
                                                            {student.stream && ` • Stream ${student.stream.name}`}
                                                        </p>
                                                    </div>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/students/${student.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            No students enrolled yet
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Learning Areas Tab */}
                        <TabsContent value="learning-areas">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Learning Areas for {grade.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {grade.grade_learning_areas && grade.grade_learning_areas.length > 0 ? (
                                        <div className="space-y-2">
                                            {grade.grade_learning_areas.map((gla: any) => (
                                                <div key={gla.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{gla.learning_area?.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Code: {gla.learning_area?.code}
                                                            {gla.teacher && ` • Teacher: ${gla.teacher.full_name}`}
                                                            {gla.pathway && ` • ${gla.pathway.name} pathway only`}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="capitalize">
                                                            {gla.pathway ? gla.pathway.name : 'Compulsory'}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleUnassignLearningArea(gla.id, gla.learning_area?.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            No learning areas assigned yet
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}