<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Report Card - {{ $student->full_name }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #1f2937; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1f2937; padding-bottom: 12px; }
        .header h1 { margin: 0 0 4px 0; font-size: 20px; }
        .header p { margin: 0; color: #6b7280; }
        table.details { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.details td { padding: 4px; }
        table.details td.label { color: #6b7280; width: 25%; }
        .exam-block { margin-bottom: 24px; page-break-inside: avoid; }
        .exam-title { font-size: 14px; font-weight: bold; background: #f3f4f6; padding: 6px 8px; margin-bottom: 6px; }
        table.marks { width: 100%; border-collapse: collapse; }
        table.marks th, table.marks td { border: 1px solid #d1d5db; padding: 5px 8px; text-align: left; font-size: 11px; }
        table.marks th { background: #f9fafb; }
        .summary-row td { font-weight: bold; background: #f9fafb; }
        .footer { margin-top: 24px; text-align: center; font-size: 10px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Student Report Card</h1>
        <p>Academic performance summary</p>
    </div>

    <table class="details">
        <tr>
            <td class="label">Name</td>
            <td>{{ $student->full_name }}</td>
            <td class="label">Admission No.</td>
            <td>{{ $student->admission_number }}</td>
        </tr>
        <tr>
            <td class="label">Class</td>
            <td>{{ $student->class->name ?? 'N/A' }}</td>
            <td class="label">Stream</td>
            <td>{{ $student->stream->name ?? 'N/A' }}</td>
        </tr>
    </table>

    @forelse($marksByExam as $entry)
        <div class="exam-block">
            <div class="exam-title">
                {{ $entry['exam']->name }}
                @if($entry['exam']->term)
                    &mdash; {{ $entry['exam']->term->name }} {{ $entry['exam']->term->academicYear->year ?? '' }}
                @endif
            </div>
            <table class="marks">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($entry['marks'] as $mark)
                        <tr>
                            <td>{{ $mark->subject->name ?? 'N/A' }}</td>
                            <td>{{ $mark->marks_obtained }} / {{ $mark->total_marks }}</td>
                            <td>{{ $mark->percentage }}%</td>
                            <td>{{ $mark->grade }}</td>
                            <td>{{ $mark->points }}</td>
                        </tr>
                    @endforeach
                    <tr class="summary-row">
                        <td colspan="4">Mean Points</td>
                        <td>{{ $entry['mean_points'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    @empty
        <p>No exam results recorded yet.</p>
    @endforelse

    <div class="footer">
        Generated on {{ now()->format('d M Y') }} — this is a computer-generated document.
    </div>
</body>
</html>