import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Pencil, Plus, ChevronDown, Trash2, BookOpen } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

function AddStrandDialog({ learningAreaId, gradeId }: { learningAreaId: number; gradeId: number }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const submit = () => {
        router.post(`/learning-areas/${learningAreaId}/grades/${gradeId}/strands`, { name, code }, {
            onSuccess: () => { setOpen(false); setName(''); setCode(''); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Strand
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Strand</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Numbers" />
                    </div>
                    <div className="space-y-2">
                        <Label>Code (optional)</Label>
                        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., NUM" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={submit} disabled={!name}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddSubStrandDialog({ strandId }: { strandId: number }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const submit = () => {
        router.post(`/strands/${strandId}/sub-strands`, { name }, {
            onSuccess: () => { setOpen(false); setName(''); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                    <Plus className="mr-1 h-3 w-3" /> Sub-strand
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Sub-strand</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Whole numbers" />
                </div>
                <DialogFooter>
                    <Button onClick={submit} disabled={!name}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddLearningOutcomeDialog({ subStrandId }: { subStrandId: number }) {
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');

    const submit = () => {
        router.post(`/sub-strands/${subStrandId}/learning-outcomes`, { description }, {
            onSuccess: () => { setOpen(false); setDescription(''); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                    <Plus className="mr-1 h-3 w-3" /> Learning Outcome
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Learning Outcome</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="By the end of the sub-strand, the learner should be able to..."
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={submit} disabled={!description}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Show({ learningArea }: { learningArea: any }) {
    const availableGrades = learningArea.grades || [];
    const [selectedGradeId, setSelectedGradeId] = useState<string>(
        availableGrades[0]?.id?.toString() || ''
    );

    const strandsForGrade = (learningArea.strands || []).filter(
        (s: any) => s.grade_id.toString() === selectedGradeId
    );

    const handleDeleteStrand = (gradeId: number, strandId: number, name: string) => {
        if (confirm(`Delete strand "${name}"? This removes its sub-strands and learning outcomes too.`)) {
            router.delete(`/learning-areas/${learningArea.id}/grades/${gradeId}/strands/${strandId}`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Learning Areas",
            href: "/learning-areas"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Learning Area - ${learningArea.name}`} />

            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/learning-areas">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{learningArea.name}</h2>
                                <p className="text-muted-foreground">Code: {learningArea.code} • {learningArea.category}</p>
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/learning-areas/${learningArea.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" /> Curriculum
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {availableGrades.length > 0 ? (
                                        <Select value={selectedGradeId} onValueChange={setSelectedGradeId}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Select grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableGrades.map((grade: any) => (
                                                    <SelectItem key={grade.id} value={grade.id.toString()}>
                                                        {grade.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Assign this learning area to a grade first (from the grade's page).
                                        </p>
                                    )}
                                    {selectedGradeId && (
                                        <AddStrandDialog
                                            learningAreaId={learningArea.id}
                                            gradeId={parseInt(selectedGradeId)}
                                        />
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {strandsForGrade.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No strands defined for this grade yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {strandsForGrade.map((strand: any) => (
                                        <Collapsible key={strand.id}>
                                            <Card>
                                                <CardHeader className="py-3">
                                                    <div className="flex items-center justify-between">
                                                        <CollapsibleTrigger asChild>
                                                            <button className="flex items-center gap-2 text-left font-medium">
                                                                <ChevronDown className="h-4 w-4" />
                                                                {strand.name}
                                                                {strand.code && (
                                                                    <Badge variant="outline" className="ml-2">{strand.code}</Badge>
                                                                )}
                                                            </button>
                                                        </CollapsibleTrigger>
                                                        <div className="flex items-center gap-2">
                                                            <AddSubStrandDialog strandId={strand.id} />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteStrand(strand.grade_id, strand.id, strand.name)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CollapsibleContent>
                                                    <CardContent className="pt-0 space-y-3">
                                                        {(strand.sub_strands || []).length === 0 && (
                                                            <p className="text-sm text-muted-foreground pl-6">No sub-strands yet.</p>
                                                        )}
                                                        {(strand.sub_strands || []).map((subStrand: any) => (
                                                            <div key={subStrand.id} className="pl-6 border-l-2 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="font-medium text-sm">{subStrand.name}</p>
                                                                    <AddLearningOutcomeDialog subStrandId={subStrand.id} />
                                                                </div>
                                                                {(subStrand.learning_outcomes || []).length === 0 ? (
                                                                    <p className="text-xs text-muted-foreground">No learning outcomes yet.</p>
                                                                ) : (
                                                                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                                                        {subStrand.learning_outcomes.map((outcome: any) => (
                                                                            <li key={outcome.id}>{outcome.description}</li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                </CollapsibleContent>
                                            </Card>
                                        </Collapsible>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {learningArea.teachers && learningArea.teachers.length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-base">Teachers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {learningArea.teachers.map((teacher: any) => (
                                        <Badge key={teacher.id} variant="outline">{teacher.full_name}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}