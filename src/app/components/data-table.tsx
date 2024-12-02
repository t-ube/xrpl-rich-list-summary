'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpDown } from 'lucide-react'
import { ExchangeIcon } from './exchange-icon'

interface Summary {
  id: number
  grouped_label: string
  count: number
  total_xrp: number
  change_1d: number | null
  percentage_1d: number | null
  change_7d: number | null
  percentage_7d: number | null
  change_30d: number | null
  percentage_30d: number | null
  created_at: string
}

const ChangeCell = ({ change, percentage }: { change: number | null; percentage: number | null }) => {
  if (!change || !percentage) return <span>-</span>
  
  const isPositive = change > 0
  const color = isPositive ? 'text-green-600' : 'text-red-600'
  const sign = isPositive ? '+' : ''

  return (
    <span className={color}>
      {sign}{change.toLocaleString()} XRP
      <br />
      <span className="text-sm">
        ({sign}{percentage.toFixed(2)}%)
      </span>
    </span>
  )
}

const LastUpdated = ({ timestamp }: { timestamp: string }) => {
  const date = new Date(timestamp)
  return (
    <div className="text-sm text-gray-500 mb-4">
      Last updated: {date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })} UTC
    </div>
  )
}

export default function DataTable({ data }: { data: Summary[] }) {
  const [sorting, setSorting] = useState<SortingState>([])

  const latestTimestamp = data.length > 0 ? data[0].created_at : null

  const columns: ColumnDef<Summary>[] = [
    {
      accessorKey: 'grouped_label',
      header: ({ column }) => {
        return (
          <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
            Wallet Label
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ExchangeIcon exchange={row.getValue('grouped_label')} />
          <span className="font-medium">{row.getValue('grouped_label')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'total_xrp',
      header: ({ column }) => {
        return (
          <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
            Total XRP
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue<number>('total_xrp').toLocaleString()} XRP
        </div>
      ),
    },
    {
      accessorKey: 'change_1d',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          24h Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_1d')}
            percentage={row.original.percentage_1d}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_7d',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          7d Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_7d')}
            percentage={row.original.percentage_7d}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_30d',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          30d Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_30d')} 
            percentage={row.original.percentage_30d}
          />
        </div>
      ),
    },
    {
      accessorKey: 'count',
      header: ({ column }) => {
        return (
          <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
            Total Wallets
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue<number>('count').toLocaleString()}
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      {latestTimestamp && <LastUpdated timestamp={latestTimestamp} />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}