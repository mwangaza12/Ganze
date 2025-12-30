import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Phone, Mail } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function FeesDefaulters({ fees }: {fees: any}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reports',
            href: '/reports',
        }
    ]
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee Defaulters Report" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/reports">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Fee Defaulters</h2>
                                <p className="text-muted-foreground">
                                    Students with outstanding balances
                                </p>
                            </div>
                        </div>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export List
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>{fees?.length} Students with Outstanding Fees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {fees?.map((fee: any) => (
                                    <Card key={fee.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">
                                                            {fee.student?.full_name}
                                                        </h3>
                                                        <Badge variant="outline">
                                                            {fee.student?.admission_number}
                                                        </Badge>
                                                        <Badge variant="secondary">
                                                            {fee.student?.class?.name}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                                                        <div>
                                                            <p className="text-muted-foreground">Amount Due</p>
                                                            <p className="font-medium">
                                                                KSh {parseFloat(fee.amount_due).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Amount Paid</p>
                                                            <p className="font-medium text-green-600">
                                                                KSh {parseFloat(fee.amount_paid).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Balance</p>
                                                            <p className="font-bold text-red-600">
                                                                KSh {parseFloat(fee.balance).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {fee.student?.guardians && fee.student.guardians.length > 0 && (
                                                        <div className="flex gap-4 text-sm">
                                                            {fee.student.guardians[0].phone && (
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Phone className="h-3 w-3" />
                                                                    {fee.student.guardians[0].phone}
                                                                </div>
                                                            )}
                                                            {fee.student.guardians[0].email && (
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Mail className="h-3 w-3" />
                                                                    {fee.student.guardians[0].email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <Button size="sm" asChild>
                                                    <Link href={`/students/${fee.student?.id}/payments/create`}>
                                                        Record Payment
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}