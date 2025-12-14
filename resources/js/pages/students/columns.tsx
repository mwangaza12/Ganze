"use client"

import { Student } from "@/types/student"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Student>[] = [
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

]