// src/app/components/content-tabs.tsx
'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SummaryContent } from '@/app/components/summary-content'
import { SummaryContentData } from '@/types/summary-content'
import { Loader2 } from 'lucide-react'
import LoadingLogo from '@/app/components/loading-logo'

type TabValue = 'total' | 'available' | 'country' | 'category';
const VALID_TABS: TabValue[] = ['total', 'available', 'country', 'category'];

interface ContentTabsProps {
  totalData: SummaryContentData;
  availableData: SummaryContentData;
  categoryData: SummaryContentData;
  countryData: SummaryContentData;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Center XRP Logo */}
    <div className="flex items-center justify-center w-full py-12">
      <div className="relative">
        <LoadingLogo />
      </div>
    </div>

    {/* Treemap skeleton */}
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-100 rounded"></div>
      </div>
      <div className="h-[600px] bg-gray-50"></div>
    </div>
    
    {/* Table skeleton */}
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-56 bg-gray-100 rounded"></div>
      </div>
      <div className="m-4 border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-4 border-b">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-100 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContentTabs: React.FC<ContentTabsProps> = ({
  totalData,
  availableData,
  categoryData,
  countryData
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const getValidTab = (tab: string | null): TabValue => {
    return VALID_TABS.includes(tab as TabValue) ? (tab as TabValue) : 'total';
  };

  const initialTab = getValidTab(searchParams.get('tab'));
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);

  const updateQueryParam = (value: TabValue) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', value);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  const handleTabChange = (value: TabValue) => {
    setIsLoading(true);
    setActiveTab(value);
    updateQueryParam(value);
    // Short timeout to allow UI to update before heavy rendering
    setTimeout(() => setIsLoading(false), 100);
  };

  const getTabContent = (value: TabValue, data: SummaryContentData['data']) => (
    <TabsContent value={value} className="mt-6">
      <Suspense fallback={<LoadingSkeleton />}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <SummaryContent data={data} sourceType={value} />
        )}
      </Suspense>
    </TabsContent>
  );

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value: string) => handleTabChange(value as TabValue)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="total" disabled={isLoading}>
          {isLoading && activeTab === 'total' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Total
        </TabsTrigger>
        <TabsTrigger value="available" disabled={isLoading}>
          {isLoading && activeTab === 'available' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Available
        </TabsTrigger>
        <TabsTrigger value="country" disabled={isLoading}>
          {isLoading && activeTab === 'country' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Country
        </TabsTrigger>
        <TabsTrigger value="category" disabled={isLoading}>
          {isLoading && activeTab === 'category' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Category
        </TabsTrigger>
      </TabsList>

      {getTabContent('total', totalData.data)}
      {getTabContent('available', availableData.data)}
      {getTabContent('country', countryData.data)}
      {getTabContent('category', categoryData.data)}
    </Tabs>
  );
};

export default ContentTabs;