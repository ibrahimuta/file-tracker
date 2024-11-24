'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatBytes, formatDate } from '@/lib/utils';
import { FileData } from '@/types';

export const columns: ColumnDef<FileData>[] = [
  {
    accessorKey: 'filename',
    header: 'File Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('filename')}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return <div className="uppercase">{row.getValue('type')}</div>;
    },
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      return <div>{formatBytes(row.getValue('size'))}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'processed'
              ? 'success'
              : status === 'processing'
              ? 'warning'
              : status === 'error'
              ? 'destructive'
              : 'secondary'
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'lastModified',
    header: 'Last Modified',
    cell: ({ row }) => {
      return <div>{formatDate(row.getValue('lastModified'))}</div>;
    },
  },
];
