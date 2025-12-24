import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Pencil, Trash2, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

function Index({ auth, exams, terms, classes, filters }) {
    const [termId, setTermId] = React.useState(filters.term_id ?? 'all');
    const [classId, setClassId] = React.useState(filters.class_id ?? 'all');
    const [type, setType] = React.useState(filters.type ?? 'all');

    const handleFilter = () => {
        router.get(
            '/exams',
            {
                term_id: termId === 'all' ? null : termId,
                class_id: classId === 'all' ? null : classId,
                type: type === 'all' ? null : type,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };


    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/exams/${id}`);
        }
    };

    const getTypeBadge = (type) => {
        const badges = {
            cat: { variant: 'secondary', label: 'CAT' },
            mid_term: { variant: 'default', label: 'Mid-Term' },
            end_term: { variant: 'default', label: 'End-Term' },
            mock: { variant: 'outline', label: 'Mock' },
            kcse: { variant: 'destructive', label: 'KCSE' }
        };
        return badges[type] || badges.cat;
    };

    return (
        <AppLayout breadcrumbs={auth.user}>
            <Head title="Exams" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Exams</h2>
                            <p className="text-muted-foreground">Manage exams and assessments</p>
                        </div>
                        <Button asChild>
                            <Link href="/exams/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Exam
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Select value={termId} onValueChange={setTermId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Terms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Terms</SelectItem>
                                        {terms?.map((term) => (
                                            <SelectItem key={term.id} value={term.id.toString()}>
                                                {term.name} - {term.academic_year?.year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

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

                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="cat">CAT</SelectItem>
                                        <SelectItem value="mid_term">Mid-Term</SelectItem>
                                        <SelectItem value="end_term">End-Term</SelectItem>
                                        <SelectItem value="mock">Mock</SelectItem>
                                        <SelectItem value="kcse">KCSE</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button onClick={handleFilter}>Apply Filters</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        {exams.data.map((exam) => {
                            const typeBadge = getTypeBadge(exam.type);
                            return (
                                <Card key={exam.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold">{exam.name}</h3>
                                                    <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p>Class: {exam.class?.name}</p>
                                                    <p>Term: {exam.term?.name} - {exam.term?.academic_year?.year}</p>
                                                    <p>Date: {exam.exam_date}</p>
                                                    <p>Total Marks: {exam.total_marks}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/exams/${exam.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/exams/${exam.id}/enter-marks`}>
                                                        <FileText className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/exams/${exam.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(exam.id, exam.name)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {exams.links && exams.links.length > 3 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {exams.from} to {exams.to} of {exams.total} results
                            </div>
                            <div className="flex gap-1">
                                {exams.links.map((link, index) => (
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
                </div>
            </div>
        </AppLayout>
    );
}

export default Index;