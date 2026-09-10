import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function CreatePayment({ student, pendingFees }: { student: any; pendingFees: any }) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: student.id,
        student_fee_id: '',
        amount: '',
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: '',
        transaction_reference: '',
        remarks: '',
    });

    const selectedFee = pendingFees?.find((fee: any) => fee.id.toString() === data.student_fee_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/payments');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fees', href: '/fees' },
        { title: student.full_name, href: `/students/${student.id}/fees` },
        { title: 'Make Payment', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Make Payment - ${student.full_name}`} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/students/${student.id}/fees`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Record Payment</h2>
                            <p className="text-muted-foreground">
                                {student.full_name} • {student.admission_number} • {student.class?.name}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>
                                Select the fee this payment is for and enter the amount received.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="student_fee_id">Fee</Label>
                                    <Select
                                        value={data.student_fee_id}
                                        onValueChange={(value) => setData('student_fee_id', value)}
                                    >
                                        <SelectTrigger id="student_fee_id">
                                            <SelectValue placeholder="Select an outstanding fee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pendingFees?.length ? (
                                                pendingFees.map((fee: any) => (
                                                    <SelectItem key={fee.id} value={fee.id.toString()}>
                                                        {fee.fee_structure?.fee_type} — Balance KSh{' '}
                                                        {parseFloat(fee.balance).toLocaleString()}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>
                                                    No outstanding fees
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.student_fee_id && (
                                        <p className="text-sm text-destructive">{errors.student_fee_id}</p>
                                    )}
                                    {selectedFee && (
                                        <p className="text-sm text-muted-foreground">
                                            Outstanding balance: KSh {parseFloat(selectedFee.balance).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (KSh)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                        />
                                        {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="payment_date">Payment Date</Label>
                                        <Input
                                            id="payment_date"
                                            type="date"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                        />
                                        {errors.payment_date && (
                                            <p className="text-sm text-destructive">{errors.payment_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <Select
                                        value={data.payment_method}
                                        onValueChange={(value) => setData('payment_method', value)}
                                    >
                                        <SelectTrigger id="payment_method">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_method && (
                                        <p className="text-sm text-destructive">{errors.payment_method}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="transaction_reference">Transaction Reference (optional)</Label>
                                    <Input
                                        id="transaction_reference"
                                        value={data.transaction_reference}
                                        onChange={(e) => setData('transaction_reference', e.target.value)}
                                        placeholder="e.g. M-Pesa code"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="remarks">Remarks (optional)</Label>
                                    <Textarea
                                        id="remarks"
                                        value={data.remarks}
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={`/students/${student.id}/fees`}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Record Payment
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}