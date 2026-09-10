<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt {{ $payment->receipt_number }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #1f2937; }
        .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #1f2937; padding-bottom: 12px; }
        .header h1 { margin: 0 0 4px 0; font-size: 20px; }
        .header p { margin: 0; color: #6b7280; }
        .receipt-box { border: 1px solid #d1d5db; padding: 16px; border-radius: 4px; }
        table.details { width: 100%; border-collapse: collapse; }
        table.details td { padding: 6px 4px; vertical-align: top; }
        table.details td.label { color: #6b7280; width: 40%; }
        .total-row td { border-top: 2px solid #1f2937; font-weight: bold; font-size: 15px; padding-top: 10px; }
        .footer { margin-top: 32px; text-align: center; font-size: 10px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Payment Receipt</h1>
        <p>Receipt No: {{ $payment->receipt_number }}</p>
    </div>

    <div class="receipt-box">
        <table class="details">
            <tr>
                <td class="label">Student</td>
                <td>{{ $payment->student->full_name }} ({{ $payment->student->admission_number }})</td>
            </tr>
            <tr>
                <td class="label">Class</td>
                <td>{{ $payment->student->class->name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Fee Type</td>
                <td>{{ $payment->studentFee->feeStructure->fee_type ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Payment Date</td>
                <td>{{ \Illuminate\Support\Carbon::parse($payment->payment_date)->format('d M Y') }}</td>
            </tr>
            <tr>
                <td class="label">Payment Method</td>
                <td>{{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</td>
            </tr>
            @if($payment->transaction_reference)
            <tr>
                <td class="label">Transaction Reference</td>
                <td>{{ $payment->transaction_reference }}</td>
            </tr>
            @endif
            <tr>
                <td class="label">Received By</td>
                <td>{{ $payment->receivedBy->name ?? 'N/A' }}</td>
            </tr>
            @if($payment->remarks)
            <tr>
                <td class="label">Remarks</td>
                <td>{{ $payment->remarks }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td class="label">Amount Paid</td>
                <td>KSh {{ number_format($payment->amount, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        This is a computer-generated receipt and does not require a signature.
    </div>
</body>
</html>