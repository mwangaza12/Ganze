import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Plus, Eye, Pencil, Trash2, RotateCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ auth, students, filters, classes, streams }) {
    const [search, setSearch] = useState(filters.search || '');
    const [classId, setClassId] = useState(filters.class_id ?? 'all');
    const [streamId, setStreamId] = useState(filters.stream_id ?? 'all');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const handleFilter = () => {
        router.get('/students', {
            search: search,
            class_id: classId,
            stream_id: streamId,
            status: status,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setClassId('');
        setStreamId('');
        setStatus('');
        router.get('/students');
    };

    const confirmDelete = (student) => {
        setStudentToDelete(student);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (studentToDelete) {
            router.delete(`/students/${studentToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setStudentToDelete(null);
                }
            });
        }
    };

    const getStatusVariant = (status) => {
        const variants = {
            active: 'default',
            transferred: 'secondary',
            graduated: 'outline',
            expelled: 'destructive',
            withdrawn: 'secondary',
        };
        return variants[status] || 'default';
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Students" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Students</h2>
                            <p className="text-muted-foreground">Manage student information and records</p>
                        </div>
                        <Button asChild>
                            <Link href="/students/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Student
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or admission..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                        className="pl-9"
                                    />
                                </div>

                                <Select value={classId} onValueChange={setClassId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Classes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classes</SelectItem>
                                        {classes?.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id.toString()}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={streamId} onValueChange={setStreamId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Streams" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Streams</SelectItem>
                                        {streams?.map((stream) => (
                                            <SelectItem key={stream.id} value={stream.id.toString()}>
                                                {stream.class.name} - {stream.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="transferred">Transferred</SelectItem>
                                        <SelectItem value="graduated">Graduated</SelectItem>
                                        <SelectItem value="expelled">Expelled</SelectItem>
                                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button onClick={handleFilter}>Apply Filters</Button>
                                <Button variant="outline" onClick={resetFilters}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {students.data.length === 0 ? (
                                    <p className="text-center py-8 text-muted-foreground">No students found</p>
                                ) : (
                                    students.data.map((student) => (
                                        <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-semibold">{student.admission_number}</span>
                                                    <span className="font-medium">{student.full_name}</span>
                                                    <Badge variant={getStatusVariant(student.status)}>{student.status}</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="capitalize">{student.gender}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{student.class?.name}</span>
                                                    {student.stream && <span> - {student.stream.name}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/students/${student.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/students/${student.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => confirmDelete(student)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {students.links && students.links.length > 3 && (
                                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing <span className="font-medium">{students.from}</span> to{' '}
                                        <span className="font-medium">{students.to}</span> of{' '}
                                        <span className="font-medium">{students.total}</span> results
                                    </div>
                                    <div className="flex gap-1">
                                        {students.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete {studentToDelete?.full_name} ({studentToDelete?.admission_number}).
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}