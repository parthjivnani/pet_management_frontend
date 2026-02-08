import { Button } from "@/components/custom/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { IconPencilMinus } from "@tabler/icons-react";
import type { Species } from "@/models/species";

export default function useColumns(
  handleOpen: (id: string | null) => void,
  handleOpenDeleteModal: (id: string) => void,
) {
  const columns: ColumnDef<Species>[] = [
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<Species> }) => (
        <div className="flex gap-1">
          <Button
            size="action"
            variant="action"
            className="text-primary bg-primary/10 hover:bg-primary/30"
            title="Edit"
            onClick={() => handleOpen(row.original._id)}
          >
            <IconPencilMinus size={15} />
          </Button>
          <Button
            size="action"
            variant="action"
            className="text-red-500 bg-red-500/10 hover:bg-red-500/30"
            title="Delete"
            onClick={() => handleOpenDeleteModal(row.original._id)}
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ),
    },
  ];
  return columns;
}
