"use client"

import { Student } from "@/types/student"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Users, 
  Phone, 
  Mail, 
  School, 
  Award, 
  Calendar,
  GraduationCap,
  Edit,
  X
} from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  student: Student | null
  mode: "view" | "edit"
}

export function StudentModal({ open, onClose, student, mode }: Props) {
    if (!student) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    {mode === "view" ? (
                    <User className="h-5 w-5 text-primary" />
                    ) : (
                    <Edit className="h-5 w-5 text-primary" />
                    )}
                </div>
                <div>
                    <DialogTitle className="text-2xl">
                    {mode === "view" ? "Student Details" : "Edit Student"}
                    </DialogTitle>
                    <DialogDescription>
                    {mode === "view" 
                        ? "Complete information about the student" 
                        : "Update student information"}
                    </DialogDescription>
                </div>
                </div>
            </div>
            </DialogHeader>

            {mode === "view" ? (
            <div className="space-y-6 pt-4">
                {/* Student Info Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <User className="h-4 w-4" />
                    STUDENT INFORMATION
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{student.name}</p>
                    </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{student.date_of_birth}</p>
                    </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Current Form</p>
                        <Badge variant="secondary" className="mt-1">
                        Form {student.form}
                        </Badge>
                    </div>
                    </div>
                </div>
                </div>

                {/* Academic Info Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <School className="h-4 w-4" />
                    ACADEMIC INFORMATION
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Previous School</p>
                        <p className="font-medium">{student.previous_school}</p>
                    </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">KCPE Marks</p>
                        <p className="font-medium">{student.kcpe_marks}</p>
                    </div>
                    </div>
                </div>
                </div>

                {/* Parent/Guardian Info Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Users className="h-4 w-4" />
                    PARENT/GUARDIAN INFORMATION
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Parent Name</p>
                        <p className="font-medium">{student.parent_name}</p>
                    </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Contact Number</p>
                        <p className="font-medium">{student.parent_contact}</p>
                    </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{student.parent_email}</p>
                    </div>
                    </div>
                </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                </div>
            </div>
            ) : (
            <div className="space-y-6 pt-4">
                {/* Student Info Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <User className="h-4 w-4" />
                    STUDENT INFORMATION
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="grid gap-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                        id="edit-name"
                        defaultValue={student.name}
                        name="name"
                    />
                    </div>

                    <div className="grid gap-2">
                    <Label htmlFor="edit-dob">Date of Birth</Label>
                    <Input
                        id="edit-dob"
                        type="date"
                        defaultValue={student.date_of_birth}
                        name="date_of_birth"
                    />
                    </div>

                    <div className="grid gap-2">
                    <Label htmlFor="edit-form">Current Form</Label>
                    <Input
                        id="edit-form"
                        defaultValue={student.form}
                        name="form"
                    />
                    </div>
                </div>
                </div>

                {/* Academic Info Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <School className="h-4 w-4" />
                    ACADEMIC INFORMATION
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="grid gap-2">
                    <Label htmlFor="edit-school">Previous School</Label>
                    <Input
                        id="edit-school"
                        defaultValue={student.previous_school}
                        name="previous_school"
                    />
                    </div>

                    <div className="grid gap-2">
                    <Label htmlFor="edit-kcpe">KCPE Marks</Label>
                    <Input
                        id="edit-kcpe"
                        type="number"
                        defaultValue={student.kcpe_marks}
                        name="kcpe_marks"
                    />
                    </div>
                </div>
                </div>

                {/* Parent/Guardian Info Section */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Users className="h-4 w-4" />
                    PARENT/GUARDIAN INFORMATION
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="grid gap-2">
                    <Label htmlFor="edit-parent-name">Parent Name</Label>
                    <Input
                        id="edit-parent-name"
                        defaultValue={student.parent_name}
                        name="parent_name"
                    />
                    </div>

                    <div className="grid gap-2">
                    <Label htmlFor="edit-parent-contact">Contact Number</Label>
                    <Input
                        id="edit-parent-contact"
                        defaultValue={student.parent_contact}
                        name="parent_contact"
                    />
                    </div>

                    <div className="grid gap-2">
                    <Label htmlFor="edit-parent-email">Email Address</Label>
                    <Input
                        id="edit-parent-email"
                        type="email"
                        defaultValue={student.parent_email}
                        name="parent_email"
                    />
                    </div>
                </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button type="submit">
                    Save Changes
                </Button>
                </div>
            </div>
            )}
        </DialogContent>
        </Dialog>
    )
}