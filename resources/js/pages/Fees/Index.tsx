import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

function FeesIndex({ feeStructures, terms, classes, filters }:{feeStructures: any, terms: any, classes: any, filters: any}) {
    const [termId, setTermId] = React.useState(filters.term_id ?? 'all');
    const [classId, setClassId] = React.useState(filters.class_id ?? 'all');

    const handleFilter = () => {
        router.get('/fees', { 
            term_id: termId === 'all' ? null : termId, 
            class_id: classId === 'all' ? null : classId
         }, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fees',
            href: '/fees'
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee Structures" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Fee Structures</h2>
                            <p className="text-muted-foreground">Manage school fees and payments</p>
                        </div>
                        <Button asChild>
                            <Link href="/fees/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Fee Structure
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select value={termId} onValueChange={setTermId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Terms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Terms</SelectItem>
                                        {terms?.map((term: any) => (
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
                                        {classes?.map((cls: any) => (
                                            <SelectItem key={cls.id} value={cls.id.toString()}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button onClick={handleFilter}>Apply Filters</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        {feeStructures?.map((fee: any) => (
                            <Card key={fee.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{fee.fee_type}</h3>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>Class: {fee.class?.name}</p>
                                                <p>Term: {fee.term?.name} - {fee.academic_year?.year}</p>
                                                <p className="text-lg font-bold text-primary">Amount: KSh {parseFloat(fee.amount).toLocaleString()}</p>
                                                {fee.description && <p className="text-sm">{fee.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
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

export default FeesIndex;