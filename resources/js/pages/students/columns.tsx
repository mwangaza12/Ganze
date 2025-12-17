"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Student } from "@/types/student"

export const columns = (
  onView: (student: Student) => void,
  onEdit: (student: Student) => void
): ColumnDef<Student>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "parent_name",
    header: "Parent Name",
  },
  {
    accessorKey: "parent_contact",
    header: "Parent Contact",
  },
  {
    accessorKey: "form",
    header: "Form",
  },
  {
    accessorKey: "previous_school",
    header: "Previous School",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original

      return (
        <div className="flex gap-2">
          <button
            onClick={() => onView(student)}
            className="text-blue-600 hover:underline"
          >
            View
          </button>

          <button
            onClick={() => onEdit(student)}
            className="text-green-600 hover:underline"
          >
            Edit
          </button>
        </div>
      )
    },
  },
]
