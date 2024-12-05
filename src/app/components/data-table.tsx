'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Row,
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
  change_1h: number | null
  percentage_1h: number | null
  change_3h: number | null
  percentage_3h: number | null
  change_24h: number | null
  percentage_24h: number | null
  change_168h: number | null
  percentage_168h: number | null
  change_720h: number | null
  percentage_720h: number | null
  created_at: string
}

// 型定義の拡張
type ChangeKeys = 'change_1h' | 'change_3h' | 'change_24h' | 'change_168h' | 'change_720h'
type PercentageKeys = 'percentage_1h' | 'percentage_3h' | 'percentage_24h' | 'percentage_168h' | 'percentage_720h'

// キーのマッピング
const percentageKeyMap: Record<ChangeKeys, PercentageKeys> = {
  'change_1h': 'percentage_1h',
  'change_3h': 'percentage_3h',
  'change_24h': 'percentage_24h',
  'change_168h': 'percentage_168h',
  'change_720h': 'percentage_720h',
}

// 共通のソート関数
const createChangeSortingFn = (columnId: string) => (rowA: Row<Summary>, rowB: Row<Summary>) => {
  const changeKey = columnId as ChangeKeys
  const percentageKey = percentageKeyMap[changeKey]
  
  const aChange = rowA.getValue(changeKey) as number | null
  const bChange = rowB.getValue(changeKey) as number | null
  const aPercentage = rowA.original[percentageKey] as number | null
  const bPercentage = rowB.original[percentageKey] as number | null
  
  function isEffectiveZero(change: number | null, percentage: number | null) {
    if (!change || !percentage) return true
    return Math.round(change) === 0 || Math.round(percentage) === 0
  }

  const aRounded = aChange ? Math.round(aChange) : 0
  const bRounded = bChange ? Math.round(bChange) : 0
  
  const aIsZero = isEffectiveZero(aChange, aPercentage)
  const bIsZero = isEffectiveZero(bChange, bPercentage)

  if (aIsZero && !bIsZero) return bRounded < 0 ? 1 : -1
  if (!aIsZero && bIsZero) return aRounded < 0 ? -1 : 1
  if (aIsZero && bIsZero) return 0
  
  return aRounded - bRounded
}

const ChangeCell = ({ change, percentage, isMobile }: { change: number | null; percentage: number | null; isMobile: boolean }) => {
  if (!change || !percentage) return <span>-</span>
  
  const roundedChange = Math.round(change)
  const roundedPercentage = Math.round(percentage)

  if (roundedChange === 0 || roundedPercentage === 0) return <span>-</span>
  
  const isPositive = roundedChange > 0
  const color = isPositive ? 'text-green-600' : 'text-red-600'
  const sign = isPositive ? '+' : ''

  return (
    <span className={color}>
      {sign}{roundedChange.toLocaleString()} {!isMobile && ' XRP'}
      <br />
      <span className="text-sm">
        ({sign}{roundedPercentage}%)
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
          {Math.round(row.getValue<number>('total_xrp')).toLocaleString()}
          {!isMobile && ' XRP'}
        </div>
      ),
    },
    {
      accessorKey: 'change_1h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" 
             onClick={() => column.toggleSorting()}>
          {isMobile ? '1h' : '1h Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_1h')}
            percentage={row.original.percentage_1h}
            isMobile={isMobile}
          />
        </div>
      ),
      sortingFn: createChangeSortingFn('change_1h')
    },
    {
      accessorKey: 'change_3h',
      header: ({ column }) => (
        <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
          {isMobile ? '3h' : '3h Change'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <ChangeCell 
            change={row.getValue('change_3h')}
            percentage={row.original.percentage_3h}
            isMobile={isMobile}
          />
        </div>
      ),
      sortingFn: createChangeSortingFn('change_3h')
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
      sortingFn: createChangeSortingFn('change_24h')
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
      sortingFn: createChangeSortingFn('change_168h')
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
      sortingFn: createChangeSortingFn('change_720h')
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