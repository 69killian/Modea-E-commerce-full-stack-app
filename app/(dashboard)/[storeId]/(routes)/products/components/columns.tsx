"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  price: string;
  size: string;
  category: string;
  color: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "isFeatured",
    header: "En tête d'affiche",
  },
  {
    accessorKey: "isArchived",
    header: "Archivé",
  },
  {
    accessorKey: "price",
    header: "Prix",
  },
  {
    accessorKey: "category",
    header: "Catégorie",
  },
  {
    accessorKey: "size",
    header: "Taille",
  },
  {
    accessorKey: "color",
    header: "Couleur",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2 ">
        {row.original.color}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
