'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState, useEffect } from 'react'
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
  change_2h: number | null
  percentage_2h: number | null
  change_4h: number | null
  percentage_4h: number | null
  change_6h: number | null
  percentage_6h: number | null
  change_12h: number | null
  percentage_12h: number | null
  change_24h: number | null
  percentage_24h: number | null
  change_168h: number | null
  percentage_168h: number | null
  change_720h: number | null
  percentage_720h: number | null
  created_at: string
}

const ChangeCell = ({ change, percentage, isMobile }: { change: number | null; percentage: number | null; isMobile: boolean }) => {
  if (!change || !percentage) return <span>-</span>
  
  const isPositive = change > 0
  const color = isPositive ? 'text-green-600' : 'text-red-600'
  const sign = isPositive ? '+' : ''

  return (
    <span className={color}>
      {sign}{change.toLocaleString()} {!isMobile && ' XRP'}
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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

export default function DataTable({ data }: { data: Summary[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const isMobile = useIsMobile()
  const latestTimestamp = data.length > 0 ? data[0].created_at : null

  const columns: ColumnDef<Summary>[] = [
    {
      accessorKey: 'grouped_label',
      header: ({ column }) => {
        return (
          <div className="flex items-center cursor-pointer bg-white" onClick={() => column.toggleSorting()}>
            {isMobile ? 'Label' : 'Wallet Label'}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: ({ row }) => {
        const label = row.getValue('grouped_label') as string
        return (
          <div className="flex items-center gap-2 bg-white">
            <ExchangeIcon exchange={label} />
            <span className="font-medium">
              {isMobile ? (label.length > 10 ? `${label.slice(0, 8)}...` : label) : label}
              {isMobile && label.length > 10 && (
                <span className="hidden group-hover:block absolute left-full top-2 ml-2 bg-gray-800 text-white p-2 rounded shadow-lg z-50 text-sm whitespace-nowrap">
                {label}
                </span>
              )}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'total_xrp',
      header: ({ column }) => {
        return (
          <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
            {isMobile ? 'Total' : 'Total XRP'}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue<number>('total_xrp').toLocaleString()}
          {!isMobile && ' XRP'}
        </div>
      ),
    },
    {
      accessorKey: 'change_2h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '2h' : '2h Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_2h')}
            percentage={row.original.percentage_2h}
            isMobile={isMobile}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_4h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '4h' : '4h Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_4h')}
            percentage={row.original.percentage_4h}
            isMobile={isMobile}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_6h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '6h' : '6h Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_6h')}
            percentage={row.original.percentage_6h}
            isMobile={isMobile}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_12h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '12h' : '12h Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_12h')}
            percentage={row.original.percentage_12h}
            isMobile={isMobile}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_24h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '24h' : '24h Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_24h')}
            percentage={row.original.percentage_24h}
            isMobile={isMobile}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_168h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '7d' : '7d Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_168h')}
            percentage={row.original.percentage_168h}
            isMobile={isMobile}
          />
        </div>
      ),
    },
    {
      accessorKey: 'change_720h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '30d' : '30d Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_720h')} 
            percentage={row.original.percentage_720h}
            isMobile={isMobile}
          />
        </div>
      ),
    },
    {
      accessorKey: 'count',
      header: ({ column }) => {
        return (
          <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
            {isMobile ? 'Wallets' : 'Total Wallets'}
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
    <div className="w-full">
      {latestTimestamp && <LastUpdated timestamp={latestTimestamp} />}
      <div className="rounded-md border">
        <div className="overflow-x-auto relative">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead 
                        key={header.id} 
                        className={`whitespace-nowrap ${
                          index === 0 
                            ? 'sticky left-0 z-10 border-r bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' 
                            : ''
                        }`}
                      >
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
                    className="group relative"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell 
                        key={cell.id} 
                        className={`whitespace-nowrap ${
                          index === 0 
                            ? 'sticky left-0 z-10 border-r bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' 
                            : ''
                        }`}
                      >
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
    </div>
  )
}