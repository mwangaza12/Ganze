"use client"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import { Student } from "@/types/student"
import { Head, Link } from "@inertiajs/react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { StudentModal } from "./student-modal"
import { Users, Plus } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Students",
        href: "/students",
    },
]

export default function Index({ students }: { students: Student[] }) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [mode, setMode] = useState<"view" | "edit">("view")
    const [open, setOpen] = useState(false)

    const handleView = (student: Student) => {
        setSelectedStudent(student)
        setMode("view")
        setOpen(true)
    }

    const handleEdit = (student: Student) => {
        setSelectedStudent(student)
        setMode("edit")
        setOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Manage and monitor student enrollment
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/students/create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Enroll Student
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Students</CardTitle>
                        <CardDescription>
                            A list of all enrolled students. Total: {students.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns(handleView, handleEdit)}
                            data={students}
                        />
                    </CardContent>
                </Card>

                <StudentModal
                    open={open}
                    onClose={() => setOpen(false)}
                    student={selectedStudent}
                    mode={mode}
                />
            </div>
        </AppLayout>
    )
}