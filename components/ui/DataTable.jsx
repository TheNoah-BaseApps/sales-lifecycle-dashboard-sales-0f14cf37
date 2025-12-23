'use client';

import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { 
  ChevronDown,
  ChevronsUpDown,
  Filter,
  MoreHorizontal,
  SortAsc,
  SortDesc
} from 'lucide-react';

export function DataTable({ 
  data, 
  columns, 
  onSelectionChange,
  bulkActions,
  pagination = true
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Row selection
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = paginatedData.map(row => row.id);
      setSelectedRows(allIds);
      if (onSelectionChange) onSelectionChange(allIds);
    } else {
      setSelectedRows([]);
      if (onSelectionChange) onSelectionChange([]);
    }
  };

  const handleSelectRow = (id, isChecked) => {
    let newSelectedRows;
    if (isChecked) {
      newSelectedRows = [...selectedRows, id];
    } else {
      newSelectedRows = selectedRows.filter(rowId => rowId !== id);
    }
    
    setSelectedRows(newSelectedRows);
    if (onSelectionChange) onSelectionChange(newSelectedRows);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' 
      ? <SortAsc className="ml-2 h-4 w-4" /> 
      : <SortDesc className="ml-2 h-4 w-4" />;
  };

  const allChecked = paginatedData.length > 0 && 
    selectedRows.length === paginatedData.length;

  const someChecked = selectedRows.length > 0 && !allChecked;

  return (
    <div className="rounded-md border">
      {/* Bulk Actions Bar */}
      {(bulkActions || selectedRows.length > 0) && (
        <div className="flex items-center justify-between p-4 bg-muted">
          {bulkActions || (
            <div className="flex items-center gap-2">
              <span>{selectedRows.length} of {paginatedData.length} row(s) selected</span>
            </div>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {/* Selection Column */}
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allChecked}
                onCheckedChange={handleSelectAll}
                indeterminate={someChecked}
              />
            </TableHead>
            
            {/* Data Columns */}
            {columns.map((column) => (
              <TableHead 
                key={column.accessorKey || column.id}
                className={column.sortable !== false ? "cursor-pointer" : ""}
                onClick={() => column.sortable !== false && requestSort(column.accessorKey)}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable !== false && getSortIcon(column.accessorKey)}
                </div>
              </TableHead>
            ))}
            
            {/* Actions Column */}
            {columns.some(col => col.cell && col.cell.toString().includes('Actions')) && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                No results found
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                  />
                </TableCell>
                
                {columns.map((column) => (
                  <TableCell key={column.accessorKey || column.id}>
                    {column.cell ? column.cell({ row }) : row[column.accessorKey]}
                  </TableCell>
                ))}
                
                {columns.some(col => col.cell && col.cell.toString().includes('Actions')) && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)} to{' '}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}