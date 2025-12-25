import React from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";

export default function Show({ stream }) {
    return (
        <AppLayout user={stream.class_teacher}>
        <Head title={`Stream: ${stream?.name ?? "Details"}`} />

        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Stream Details</h1>
            <p className="text-muted-foreground">
                View stream information, class, teacher, and enrolled students
            </p>
            </div>

            {/* Stream Info */}
            <Card>
            <CardHeader>
                <CardTitle>Stream Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                <span className="font-medium">Name:</span> {stream.name}
                </div>
                {stream.description && (
                <div>
                    <span className="font-medium">Description:</span>{" "}
                    {stream.description}
                </div>
                )}
            </CardContent>
            </Card>

            {/* Class & Teacher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                <CardTitle>Class</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                <div>
                    <span className="font-medium">Class Name:</span>{" "}
                    {stream.class?.name ?? "—"}
                </div>
                {stream.class?.section && (
                    <div>
                    <span className="font-medium">Section:</span>{" "}
                    {stream.class.section}
                    </div>
                )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Class Teacher</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                {stream.class_teacher ? (
                    <>
                    <div>
                        <span className="font-medium">Name:</span>{" "}
                        {stream.class_teacher.name}
                    </div>
                    <div>
                        <span className="font-medium">Email:</span>{" "}
                        {stream.class_teacher.email}
                    </div>
                    </>
                ) : (
                    <span className="text-muted-foreground">No teacher assigned</span>
                )}
                </CardContent>
            </Card>
            </div>

            {/* Students */}
            <Card>
            <CardHeader>
                <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
                {stream.students?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {stream.students.map((student) => (
                    <Badge key={student.id} variant="secondary">
                        {student.name}
                    </Badge>
                    ))}
                </div>
                ) : (
                <span className="text-muted-foreground">No students enrolled</span>
                )}
            </CardContent>
            </Card>
        </div>
        </AppLayout>
    );
}
