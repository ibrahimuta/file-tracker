"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/utils";

const stageColors = {
  ordered: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  invoiced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  remitted: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  complete: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
} as const;

export const columns: ColumnDef<FileData>[] = [
  {
    accessorKey: "filename",
    header: "File Name",
    cell: ({ row }) => {
      const file = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{file.filename}</span>
          {file.documentUrl && (
            <a
              href={file.documentUrl}
              className="text-xs text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.getValue("type")}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {formatFileSize(row.getValue("size"))}
        </div>
      );
    },
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = row.getValue("stage") as keyof typeof stageColors;
      return (
        <Badge variant="secondary" className={stageColors[stage]}>
          {stage.charAt(0).toUpperCase() + stage.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(row.getValue("lastModified")).toLocaleString()}
        </div>
      );
    },
  },
];
