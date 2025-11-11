import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export interface SimpleTableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

export function SimpleTable<T extends { id: string | number }>({
  data,
  columns,
  className,
}: {
  data: T[];
  columns: SimpleTableColumn<T>[];
  className?: string;
}) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border', className)}>
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={cn('px-4 py-2 text-left font-medium', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="even:bg-muted/10">
              {columns.map((col, idx) => (
                <td key={idx} className={cn('px-4 py-2 align-top', col.className)}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

