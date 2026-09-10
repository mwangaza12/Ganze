import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Receipt({ payment }: { payment: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fees', href: '/fees' },
        { title: 'Receipt', href: '#' },
    ];

    const row = (label: string, value: React.ReactNode) => (
        <div className="flex justify-between py-2 border-b last:border-b-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Receipt ${payment.receipt_number}`} />

            <div className="py-6">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/students/${payment.student.id}/fees`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Payment Receipt</h2>
                                <p className="text-muted-foreground">{payment.receipt_number}</p>
                            </div>
                        </div>
                        <Button asChild>
                            <a href={`/payments/${payment.receipt_number}/receipt/pdf`}>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </a>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>Payment Recorded</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-6">
                                <p className="text-3xl font-bold">
                                    KSh {parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="space-y-0">
                                {row('Student', `${payment.student.full_name} (${payment.student.admission_number})`)}
                                {row('Class', payment.student.class?.name ?? 'N/A')}
                                {row('Fee Type', payment.student_fee?.fee_structure?.fee_type ?? 'N/A')}
                                {row('Payment Date', payment.payment_date)}
                                {row('Payment Method', String(payment.payment_method).replace('_', ' '))}
                                {payment.transaction_reference && row('Transaction Reference', payment.transaction_reference)}
                                {row('Received By', payment.received_by?.name ?? 'N/A')}
                                {payment.remarks && row('Remarks', payment.remarks)}
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground mt-4">
                        This is a computer-generated receipt.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}