'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';

export default function LoginSignupTable({ data, onEdit, onDelete }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      header: 'Date',
      accessorKey: 'event_date',
      cell: ({ row }) => new Date(row.original.event_date).toLocaleDateString()
    },
    {
      header: 'User ID',
      accessorKey: 'user_id'
    },
    {
      header: 'Event Type',
      accessorKey: 'event_type'
    },
    {
      header: 'IP Address',
      accessorKey: 'ip_address'
    },
    {
      header: 'User Agent',
      accessorKey: 'user_agent'
    },
    {
      header: 'Status',
      accessorKey: 'status'
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      onSelectionChange={setSelectedRows}
      bulkActions={
        selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            <span>{selectedRows.length} selected</span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                selectedRows.forEach(id => onDelete(id));
                setSelectedRows([]);
              }}
            >
              Delete Selected
            </Button>
          </div>
        )
      }
    />
  );
}