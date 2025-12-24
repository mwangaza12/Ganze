import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Pencil, Users, BookOpen, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Show({ auth, classItem }) {
    const handleDeleteStream = (streamId, streamName) => {
        if (confirm(`Are you sure you want to delete stream ${streamName}?`)) {
            router.delete(`/classes/${classItem.id}/streams/${streamId}`);
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Class - ${classItem.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/classes">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{classItem.name}</h2>
                                <p className="text-muted-foreground">Form {classItem.level}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`/classes/${classItem.id}/streams/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Stream
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/classes/${classItem.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Class
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
                                <p className="text-2xl font-bold">{classItem.students?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">out of {classItem.capacity}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Streams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{classItem.streams?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">active streams</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{classItem.subjects?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">assigned subjects</p>
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
                            <TabsTrigger value="subjects">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Subjects
                            </TabsTrigger>
                        </TabsList>

                        {/* Streams Tab */}
                        <TabsContent value="streams">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Streams</CardTitle>
                                        <Button size="sm" asChild>
                                            <Link href={`/classes/${classItem.id}/streams/create`}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Stream
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {classItem.streams && classItem.streams.length > 0 ? (
                                        <div className="space-y-3">
                                            {classItem.streams.map((stream) => (
                                                <Card key={stream.id}>
                                                    <CardContent className="pt-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-lg">
                                                                    {classItem.name} - {stream.name}
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
                                                                    <Link href={`/classes/${classItem.id}/streams/${stream.id}/edit`}>
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
                                    <CardTitle>Students in {classItem.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {classItem.students && classItem.students.length > 0 ? (
                                        <div className="space-y-2">
                                            {classItem.students.map((student) => (
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

                        {/* Subjects Tab */}
                        <TabsContent value="subjects">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subjects for {classItem.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {classItem.classSubjects && classItem.classSubjects.length > 0 ? (
                                        <div className="space-y-2">
                                            {classItem.classSubjects.map((classSubject) => (
                                                <div key={classSubject.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{classSubject.subject?.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Code: {classSubject.subject?.code}
                                                            {classSubject.teacher && ` • Teacher: ${classSubject.teacher.full_name}`}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="capitalize">
                                                        {classSubject.subject?.category}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            No subjects assigned yet
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