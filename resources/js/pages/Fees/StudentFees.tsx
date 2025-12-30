import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function StudentFees({ student, fees, summary }:{ student: any, fees: any, summary: any}) {
    const getStatusVariant = (status: any) => {
        const variants = {
            paid: 'default',
            partial: 'secondary',
            pending: 'outline',
            overdue: 'destructive',
        };
        return variants[status] || 'outline';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Fees",
            href: "/fees"
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Fees - ${student.full_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/students/${student.id}`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{student.full_name}</h2>
                                <p className="text-muted-foreground">
                                    {student.admission_number} • {student.class?.name}
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/students/${student.id}/payments/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Make Payment
                            </Link>
                        </Button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Due</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    KSh {summary.total_due?.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    KSh {summary.total_paid?.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    KSh {summary.total_balance?.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fee Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {fees?.map((fee: any) => (
                                    <div key={fee.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">{fee.fee_structure?.fee_type}</p>
                                                <Badge variant={getStatusVariant(fee.status)}>{fee.status}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {fee.fee_structure?.term?.name} - {fee.fee_structure?.academic_year?.year}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">KSh {parseFloat(fee.amount_due).toLocaleString()}</p>
                                            <p className="text-sm text-green-600">
                                                Paid: KSh {parseFloat(fee.amount_paid).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-red-600">
                                                Balance: KSh {parseFloat(fee.balance).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}