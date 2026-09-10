import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Pencil, User, GraduationCap, Wallet, CalendarDays } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

// ---- design tokens (page-local) ---------------------------------------
const ink = '#1B1F23';
const inkMuted = '#667085';
const line = '#E5E5E1';
const accent = '#33513F';
const accentSoft = '#E9F0EA';
const gold = '#A9812F';
const success = '#2F6E4B';
const danger = '#B3261E';

const STATUS_META: Record<string, { color: string; label: string }> = {
  active: { color: success, label: 'Active' },
  transferred: { color: gold, label: 'Transferred' },
  graduated: { color: accent, label: 'Graduated' },
  expelled: { color: danger, label: 'Expelled' },
  withdrawn: { color: inkMuted, label: 'Withdrawn' },
};

function initialsFrom(name: string) {
  return (name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function gradeTone(grade: string) {
  const g = (grade || '').charAt(0).toUpperCase();
  if (g === 'A') return { color: success, bg: '#EAF3EE' };
  if (g === 'B') return { color: accent, bg: accentSoft };
  if (g === 'C') return { color: gold, bg: '#F5EEDD' };
  return { color: danger, bg: '#F8E9E8' };
}

function StatusDot({ status }: { status: string }) {
  const meta = STATUS_META[status] || { color: inkMuted, label: status };
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      <span className="text-sm font-medium" style={{ color: ink }}>
        {meta.label}
      </span>
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 py-2.5"
      style={{ borderBottom: `1px solid ${line}` }}
    >
      <span className="text-sm" style={{ color: inkMuted }}>
        {label}
      </span>
      <span className="text-sm font-medium text-right" style={{ color: ink }}>
        {value}
      </span>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-white p-5" style={{ borderColor: line }}>
      <h3
        className="mb-1 text-[15px] font-semibold"
        style={{ color: ink, fontFamily: "'Source Serif 4', Georgia, serif" }}
      >
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function Show({ auth, student }: { auth: any; student: any }) {
  const fees = student.fees ?? [];
  const totalDue = fees.reduce((sum: number, fee: any) => sum + parseFloat(fee.amount_due || 0), 0);
  const totalPaid = fees.reduce((sum: number, fee: any) => sum + parseFloat(fee.amount_paid || 0), 0);
  const balance = fees.reduce((sum: number, fee: any) => sum + parseFloat(fee.balance || 0), 0);

  return (
    <AppLayout breadcrumbs={auth.user}>
      <Head title={`Student - ${student.full_name}`}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Record header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Button variant="ghost" size="icon" asChild className="mt-1 shrink-0">
                <Link href="/students">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>

              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
                style={{ backgroundColor: accentSoft, color: accent, fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                {initialsFrom(student.full_name)}
              </div>

              <div>
                <h2
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: ink, fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  {student.full_name}
                </h2>
                <p className="mt-0.5 text-sm" style={{ color: inkMuted }}>
                  Admission {student.admission_number}
                  {student.class?.name ? `  ·  ${student.class.name}` : ''}
                  {student.stream ? ` - ${student.stream.name}` : ''}
                </p>
              </div>
            </div>

            <Button asChild>
              <Link href={`/students/${student.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit student
              </Link>
            </Button>
          </div>

          {/* Record strip */}
          <div
            className="mb-8 grid grid-cols-2 divide-x rounded-md border bg-white sm:grid-cols-4"
            style={{ borderColor: line }}
          >
            {[
              { label: 'Status', value: <StatusDot status={student.status} /> },
              {
                label: 'Class',
                value: `${student.class?.name ?? '—'}${student.stream ? ` - ${student.stream.name}` : ''}`,
              },
              { label: 'Age', value: `${student.age} years` },
              { label: 'Gender', value: student.gender, capitalize: true },
            ].map((item, i) => (
              <div key={i} className="px-5 py-4" style={{ borderColor: line }}>
                <p className="text-xs" style={{ color: inkMuted }}>
                  {item.label}
                </p>
                <div
                  className={`mt-1.5 text-[15px] font-medium ${item.capitalize ? 'capitalize' : ''}`}
                  style={{ color: ink }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList
              className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0"
              style={{ borderColor: line }}
            >
              {[
                { value: 'info', label: 'Information', Icon: User },
                { value: 'guardians', label: 'Guardians', Icon: User },
                { value: 'attendance', label: 'Attendance', Icon: CalendarDays },
                { value: 'exams', label: 'Exams', Icon: GraduationCap },
                { value: 'fees', label: 'Fees', Icon: Wallet },
              ].map(({ value, label, Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-none border-b-2 border-transparent bg-transparent px-0.5 pb-3 pt-0 text-sm font-medium shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  style={{ color: inkMuted }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Information */}
            <TabsContent value="info" className="mt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Panel title="Personal">
                  <InfoRow label="Full name" value={student.full_name} />
                  <InfoRow label="Date of birth" value={student.date_of_birth} />
                  <InfoRow label="Birth certificate" value={student.birth_certificate_number || 'N/A'} />
                  <InfoRow label="Admission date" value={student.admission_date} />
                </Panel>

                <Panel title="Contact">
                  <InfoRow label="County" value={student.county || 'N/A'} />
                  <InfoRow label="Sub county" value={student.sub_county || 'N/A'} />
                  <InfoRow label="Address" value={student.address || 'N/A'} />
                </Panel>

                <Panel title="Medical">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm" style={{ color: inkMuted }}>
                        Conditions
                      </p>
                      <p className="mt-1 text-sm" style={{ color: ink }}>
                        {student.medical_conditions || 'None recorded'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: inkMuted }}>
                        Allergies
                      </p>
                      <p className="mt-1 text-sm" style={{ color: ink }}>
                        {student.allergies || 'None recorded'}
                      </p>
                    </div>
                  </div>
                </Panel>
              </div>
            </TabsContent>

            {/* Guardians */}
            <TabsContent value="guardians" className="mt-0">
              <div className="rounded-md border bg-white" style={{ borderColor: line }}>
                {student.guardians && student.guardians.length > 0 ? (
                  student.guardians.map((guardian: any, i: number) => (
                    <div
                      key={guardian.id}
                      className="grid grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-4"
                      style={i > 0 ? { borderTop: `1px solid ${line}` } : undefined}
                    >
                      <div>
                        <p className="text-xs" style={{ color: inkMuted }}>Name</p>
                        <p className="mt-1 text-sm font-medium" style={{ color: ink }}>{guardian.full_name}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: inkMuted }}>Relationship</p>
                        <p className="mt-1 text-sm font-medium capitalize" style={{ color: ink }}>{guardian.relationship}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: inkMuted }}>Phone</p>
                        <p className="mt-1 text-sm font-medium" style={{ color: ink }}>{guardian.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: inkMuted }}>Email</p>
                        <p className="mt-1 text-sm font-medium" style={{ color: ink }}>{guardian.email || 'N/A'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-8 text-center text-sm" style={{ color: inkMuted }}>
                    No guardian information on file
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Attendance */}
            <TabsContent value="attendance" className="mt-0">
              <div className="rounded-md border bg-white" style={{ borderColor: line }}>
                {student.attendance && student.attendance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: line }}>
                        <TableHead style={{ color: inkMuted }}>Date</TableHead>
                        <TableHead style={{ color: inkMuted }}>Status</TableHead>
                        <TableHead style={{ color: inkMuted }}>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.attendance.map((record: any) => (
                        <TableRow key={record.id} style={{ borderColor: line }}>
                          <TableCell style={{ color: ink }}>{record.date}</TableCell>
                          <TableCell>
                            <span
                              className="inline-flex items-center gap-2 text-sm font-medium"
                              style={{ color: record.status === 'present' ? success : danger }}
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: record.status === 'present' ? success : danger }}
                              />
                              {record.status}
                            </span>
                          </TableCell>
                          <TableCell style={{ color: inkMuted }}>{record.remarks || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="px-5 py-8 text-center text-sm" style={{ color: inkMuted }}>
                    No attendance records yet
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Exams */}
            <TabsContent value="exams" className="mt-0">
              <div className="rounded-md border bg-white" style={{ borderColor: line }}>
                {student.marks && student.marks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: line }}>
                        <TableHead style={{ color: inkMuted }}>Exam</TableHead>
                        <TableHead style={{ color: inkMuted }}>Subject</TableHead>
                        <TableHead className="text-right" style={{ color: inkMuted }}>Marks</TableHead>
                        <TableHead style={{ color: inkMuted }}>Grade</TableHead>
                        <TableHead className="text-right" style={{ color: inkMuted }}>Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.marks.map((mark: any) => {
                        const tone = gradeTone(mark.grade);
                        return (
                          <TableRow key={mark.id} style={{ borderColor: line }}>
                            <TableCell style={{ color: ink }}>{mark.exam?.name}</TableCell>
                            <TableCell style={{ color: ink }}>{mark.subject?.name}</TableCell>
                            <TableCell className="text-right tabular-nums" style={{ color: ink }}>
                              {mark.marks_obtained}/{mark.total_marks}
                            </TableCell>
                            <TableCell>
                              <span
                                className="inline-flex h-6 min-w-6 items-center justify-center rounded px-1.5 text-xs font-semibold"
                                style={{ backgroundColor: tone.bg, color: tone.color }}
                              >
                                {mark.grade}
                              </span>
                            </TableCell>
                            <TableCell className="text-right tabular-nums" style={{ color: ink }}>{mark.points}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="px-5 py-8 text-center text-sm" style={{ color: inkMuted }}>
                    No exam results available
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Fees */}
            <TabsContent value="fees" className="mt-0 space-y-4">
              <div
                className="grid grid-cols-3 divide-x rounded-md border bg-white"
                style={{ borderColor: line }}
              >
                <div className="px-5 py-4">
                  <p className="text-xs" style={{ color: inkMuted }}>Total due</p>
                  <p className="mt-1.5 text-xl font-semibold tabular-nums" style={{ color: ink }}>
                    KSh {totalDue.toLocaleString()}
                  </p>
                </div>
                <div className="px-5 py-4" style={{ borderColor: line }}>
                  <p className="text-xs" style={{ color: inkMuted }}>Total paid</p>
                  <p className="mt-1.5 text-xl font-semibold tabular-nums" style={{ color: success }}>
                    KSh {totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="px-5 py-4" style={{ borderColor: line }}>
                  <p className="text-xs" style={{ color: inkMuted }}>Balance</p>
                  <p className="mt-1.5 text-xl font-semibold tabular-nums" style={{ color: balance > 0 ? danger : ink }}>
                    KSh {balance.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="rounded-md border bg-white" style={{ borderColor: line }}>
                <div className="px-5 pt-4">
                  <h3
                    className="text-[15px] font-semibold"
                    style={{ color: ink, fontFamily: "'Source Serif 4', Georgia, serif" }}
                  >
                    Payment history
                  </h3>
                </div>
                {student.payments && student.payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: line }}>
                        <TableHead style={{ color: inkMuted }}>Receipt no.</TableHead>
                        <TableHead style={{ color: inkMuted }}>Date</TableHead>
                        <TableHead className="text-right" style={{ color: inkMuted }}>Amount</TableHead>
                        <TableHead style={{ color: inkMuted }}>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.payments.map((payment: any) => (
                        <TableRow key={payment.id} style={{ borderColor: line }}>
                          <TableCell className="font-medium" style={{ color: ink }}>{payment.receipt_number}</TableCell>
                          <TableCell style={{ color: inkMuted }}>{payment.payment_date}</TableCell>
                          <TableCell className="text-right tabular-nums" style={{ color: ink }}>
                            KSh {parseFloat(payment.amount).toLocaleString()}
                          </TableCell>
                          <TableCell className="capitalize" style={{ color: inkMuted }}>{payment.payment_method}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="px-5 py-8 text-center text-sm" style={{ color: inkMuted }}>
                    No payment history
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}