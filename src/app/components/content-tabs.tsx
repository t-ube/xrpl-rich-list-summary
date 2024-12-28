// src/app/components/content-tabs.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SummaryContent } from '@/app/components/summary-content'
import { SummaryContentData } from '@/types/summary-content'

interface ContentTabsProps {
  totalData: SummaryContentData;
  availableData: SummaryContentData;
  categoryData: SummaryContentData;
  countryData: SummaryContentData;
}

export default function ContentTabs({
  totalData,
  availableData,
  categoryData,
  countryData
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState('total')
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="total">Total</TabsTrigger>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="country">Country</TabsTrigger>
        <TabsTrigger value="category">Category</TabsTrigger>
      </TabsList>

      <TabsContent value="total">
        <SummaryContent data={totalData.data} sourceType={activeTab}/>
      </TabsContent>
      <TabsContent value="available">
        <SummaryContent data={availableData.data} sourceType={activeTab}/>
      </TabsContent>
      <TabsContent value="country">
        <SummaryContent data={countryData.data} sourceType={activeTab}/>
      </TabsContent>
      <TabsContent value="category">
        <SummaryContent data={categoryData.data} sourceType={activeTab}/>
      </TabsContent>
    </Tabs>
  )
}
