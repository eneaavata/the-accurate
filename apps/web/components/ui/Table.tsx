'use client';
import React, { useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';
import { Tooltip } from './Tooltip';

export type TableAction<T> = {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  className?: string;
};

export type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
  thClassName?: string;
  tdClassName?: string | ((row: T) => string);
  actions?: TableAction<T>[];
  tooltip?: boolean;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onSelectionChange?: (selected: T[], selectedRows: Set<string | number>) => void;
  selectedRowIds?: Array<string | number>;
  onRemoveSelectedRow?: (id: string | number) => void;
  hasCheckBox?: boolean;
  sortConfig?: { sortBy: string; order: 'asc' | 'desc' } | null;
  onSortChange?: (sort: { sortBy: string; order: 'asc' | 'desc' } | null) => void;
  rowClassName?: (row: T, index: number) => string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className,
  onSelectionChange,
  selectedRowIds = [],
  hasCheckBox = true,
  sortConfig = null,
  onSortChange,
  rowClassName,
}: DataTableProps<T>) {
  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);
  const selectedRows = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);

  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        selectedRows.size > 0 && selectedRows.size < data.length;
    }
  }, [selectedRows, data]);

  const loadingSkeleton = useMemo(() => {
    return [...Array(12)].map((_, i) => (
      <tr key={i} className="border-b border-gray-200">
        {hasCheckBox && (
          <td className="px-4 py-3 w-8">
            <Skeleton className="h-4 w-full rounded" />
          </td>
        )}
        {columns.map((col, j) => (
          <td key={j} className="px-4 py-3">
            <Skeleton className="h-4 w-full rounded" />
          </td>
        ))}
      </tr>
    ));
  }, [columns, hasCheckBox]);

  if (data.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg">
        <div className="text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-auto rounded-lg border border-gray-200 shadow-sm', className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-50 text-left text-gray-700 border-b border-gray-200">
            {hasCheckBox && (
              <th className="py-3 px-4 font-medium whitespace-nowrap w-8">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={data.length > 0 && data.every((row) => selectedRows.has(row.id))}
                  onChange={(e) => {
                    if (onSelectionChange) {
                      const currentPageIds = new Set(data.map((row) => row.id));
                      const newSet = new Set(selectedRows);
                      if (e.target.checked) {
                        currentPageIds.forEach((id) => newSet.add(id));
                      } else {
                        currentPageIds.forEach((id) => newSet.delete(id));
                      }
                      const selected = data.filter((r) => newSet.has(r.id));
                      onSelectionChange(selected, newSet);
                    }
                  }}
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortConfig && sortConfig.sortBy === col.key;
              return (
                <th
                  key={String(col.key)}
                  className={cn(
                    'py-3 px-4 font-medium whitespace-nowrap',
                    col.sortable ? 'cursor-pointer hover:bg-gray-100' : '',
                    col.thClassName || ''
                  )}
                  style={{ width: col.width }}
                  onClick={() => {
                    if (col.sortable && onSortChange) {
                      if (isSorted) {
                        if (sortConfig!.order === 'asc') {
                          onSortChange({ sortBy: String(col.key), order: 'desc' });
                        } else {
                          onSortChange(null);
                        }
                      } else {
                        onSortChange({ sortBy: String(col.key), order: 'asc' });
                      }
                    }
                  }}
                >
                  <div className={cn('flex items-center gap-2', col.thClassName)}>
                    {col.label}
                    {col.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp
                          className={`w-3 h-3 ${isSorted && sortConfig!.order === 'asc' ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                        <ChevronDown
                          className={`w-3 h-3 -mt-1 ${isSorted && sortConfig!.order === 'desc' ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading
            ? loadingSkeleton
            : data.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b hover:bg-gray-200 border-gray-200 group',
                    onRowClick ? 'cursor-pointer' : '',
                    rowClassName ? rowClassName(row, index) : ''
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {hasCheckBox && (
                    <td className="px-4  w-8">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={(e) => {
                          if (onSelectionChange) {
                            const newSet = new Set(selectedRows);
                            if (e.target.checked) {
                              newSet.add(row.id);
                            } else {
                              newSet.delete(row.id);
                            }
                            const selected = data.filter((r) => newSet.has(r.id));
                            onSelectionChange(selected, newSet);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        'px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis',
                        typeof col.tdClassName === 'function'
                          ? col.tdClassName(row)
                          : col.tdClassName || ''
                      )}
                      style={{
                        width: col.width,
                        maxWidth: col.width || '200px',
                      }}
                    >
                      {col.key === 'actions' && col.actions ? (
                        <div className="flex justify-end gap-2">
                          {col.actions.map((action, actionIdx) => (
                            <button
                              key={actionIdx}
                              type="button"
                              className={cn(
                                'inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors',
                                action.className || ''
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                            >
                              {action.icon && action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <Tooltip
                          disabled={!col?.tooltip}
                          content={col.render ? col.render(row) : (row as any)[col.key]}
                        >
                          <span className="block truncate w-full">
                            {col.render ? col.render(row) : (row as any)[col.key]}
                          </span>
                        </Tooltip>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
