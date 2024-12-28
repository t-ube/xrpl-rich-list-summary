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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, useEffect, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpDown } from 'lucide-react'
import { CloudinaryExchangeIcon } from './cloudinary-exchange-icon'
//import WalletBalanceChart from '@/app/components/wallet-balance-chart'
import WalletBalanceAndPriceChart from '@/app/components/wallet-balance-and-price-chart'
import { MarketDataResponse } from '@/types/market-data'
import { RichListSummaryWithChanges } from '@/types/rich_list_changes'
import { CountryIcon } from '@/app/components/country-icon'
import { CategoryIcon } from '@/app/components/category-icon'

interface DataTableProps {
  data: RichListSummaryWithChanges[];
  priceData: MarketDataResponse[] | null;
  sourceType: string;
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
const createChangeSortingFn = (columnId: string) => (rowA: Row<RichListSummaryWithChanges>, rowB: Row<RichListSummaryWithChanges>) => {
  const changeKey = columnId as ChangeKeys
  const percentageKey = percentageKeyMap[changeKey]
  
  const aChange = rowA.getValue(changeKey) as number | null
  const bChange = rowB.getValue(changeKey) as number | null
  const aPercentage = rowA.original[percentageKey] as number | null
  const bPercentage = rowB.original[percentageKey] as number | null
  
  const CHANGE_THRESHOLD = 1.0 // 1.0 XRP未満の変化は0として扱う
  const PERCENTAGE_THRESHOLD = 0.001 // 0.001%未満の変化も0として扱う

  function isEffectiveZero(change: number | null, percentage: number | null) {
    if (!change || !percentage) return true
    return Math.abs(change) < CHANGE_THRESHOLD || Math.abs(percentage) < PERCENTAGE_THRESHOLD
  }

  const aIsZero = isEffectiveZero(aChange, aPercentage)
  const bIsZero = isEffectiveZero(bChange, bPercentage)

  if (aIsZero && !bIsZero) return bChange! < 0 ? 1 : -1
  if (!aIsZero && bIsZero) return aChange! < 0 ? -1 : 1
  if (aIsZero && bIsZero) return 0
  
  return (aChange || 0) - (bChange || 0)
}

const ChangeCell = ({ change, percentage, isMobile }: { change: number | null; percentage: number | null; isMobile: boolean }) => {
  if (!change || !percentage) return <span>-</span>
  
  const CHANGE_THRESHOLD = 1.0
  const PERCENTAGE_THRESHOLD = 0.001

  const isEffectiveZero = Math.abs(change) < CHANGE_THRESHOLD || Math.abs(percentage) < PERCENTAGE_THRESHOLD
  if (isEffectiveZero) return <span>-</span>
  
  const isPositive = change > 0
  const color = isPositive ? 'text-green-600' : 'text-red-600'
  const sign = isPositive ? '+' : ''

  const getPercentageDisplay = (percentage: number) => {
    if (Math.abs(percentage) < PERCENTAGE_THRESHOLD) return '0%'
    if (Math.abs(percentage) < 0.01) return percentage > 0 ? '<+0.01%' : '<-0.01%'
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`
  }

  return (
    <span className={color}>
      {sign}{Math.round(change).toLocaleString()} {!isMobile && ' XRP'}
      <br />
      <span className="text-sm">
        ({getPercentageDisplay(percentage)})
      </span>
    </span>
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

const getIcon = (sourceType:string, row: Row<RichListSummaryWithChanges>) => {
  const label = row.getValue('grouped_label') as string

  if (sourceType == 'country') {
    return <CountryIcon country={label}/>
  } else if (sourceType == 'category') {
    return <CategoryIcon category={label}/>
  }
  return <CloudinaryExchangeIcon exchange={label} />
}

// 基本のカラム配列を取得
const getBaseColumns = (isMobile: boolean, sourceType: string): ColumnDef<RichListSummaryWithChanges>[] => {
  let extendColumns: ColumnDef<RichListSummaryWithChanges>[] = []

  if (!isMobile && (sourceType === 'total' || sourceType === 'available')) {
    extendColumns = [
      {
        accessorKey: 'entity_country',
        header: ({ column }) => {
          return (
            <div className="flex items-center justify-center cursor-pointer" onClick={() => column.toggleSorting()}>
              {'Country'}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          )
        },
        cell: ({ row }) => {
          const country = row.getValue('entity_country') as string
          return (
            <div className="flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CountryIcon country={country}/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{country}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        },
      },
      {
        accessorKey: 'entity_category',
        header: ({ column }) => {
          return (
            <div className="flex items-center justify-center cursor-pointer" onClick={() => column.toggleSorting()}>
              {'Category'}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          )
        },
        cell: ({ row }) => {
          const category = row.getValue('entity_category') as string
          return (
            <div className="flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CategoryIcon category={category}/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{category}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        },
      },
    ]
  }

  return [
    // Label column
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
            {getIcon(sourceType, row)}
            <span className="font-medium">
              {isMobile ? (label.length > 10 ? `${label.slice(0, 8)}...` : label) : label}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'show_total_xrp',
      header: ({ column }) => {
        return (
          <div className="text-right flex items-center justify-end cursor-pointer" onClick={() => column.toggleSorting()}>
            {getTotalTitle(isMobile, sourceType)}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {Math.round(row.getValue<number>('show_total_xrp')).toLocaleString()}
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
    ...extendColumns,
  ]
}

const getTotalTitle = (isMobile:boolean, sourceType:string): string => {
  switch (sourceType) {
    case "total":
      if (isMobile)
        return "Total";
      else
        return "Total XRP";
    case "available":
      if (isMobile)
        return "Available";
      else
        return "Available XRP";
    case "country":
      if (isMobile)
        return "Total";
      else
        return "Total XRP";
    case "category":
      if (isMobile)
        return "Total";
      else
        return "Total XRP";
    default:
      if (isMobile)
        return "Total";
      else
        return "Total XRP";
  }
};

export default function DataTable({ data, priceData, sourceType }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const isMobile = useIsMobile()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);



  const columns = useMemo(
    () => getBaseColumns(isMobile, sourceType),
    [isMobile, sourceType]
  )

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

  const handleRowClick = (label: string) => {
    setSelectedWallet(label);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className={`p-4 ${isMobile ? 'pb-2' : 'p-4'} border-b`}>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
            Rich Wallet Changes
          </h2>
          <p className={`text-sm text-gray-500 ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
            Balance changes and wallet count by label
          </p>
        </div>
        <div className={`rounded-md border ${isMobile ? 'mx-2 my-2' : 'm-4'}`}>
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
                      className="group relative cursor-pointer"
                      onClick={() => handleRowClick(row.getValue('grouped_label'))}
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
      <WalletBalanceAndPriceChart
        walletLabel={selectedWallet || ''}
        isOpen={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        isMobile={isMobile}
        priceData={priceData}
        sourceType={sourceType}
      />
    </div>
  )
}

