// src/app/components/tabs-with-swiper.tsx
'use client'

import { useState, useRef } from 'react'
import { Swiper as SwiperType } from 'swiper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { SummaryContent, SummaryContentProps } from '@/app/components/summary-content'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface TabsWithSwiperProps {
  totalData: SummaryContentProps;
  availableData: SummaryContentProps;
  categoryData: SummaryContentProps;
  countryData: SummaryContentProps;
}

export default function TabsWithSwiper({
  totalData,
  availableData,
  categoryData,
  countryData
}: TabsWithSwiperProps) {
  const [activeTab, setActiveTab] = useState('total')
  const swiperRef = useRef<SwiperType>()
  
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const tabIndex = ['total', 'available', 'category', 'country'].indexOf(value)
    if (swiperRef.current && tabIndex !== -1) {
      swiperRef.current.slideTo(tabIndex)
    }
  }

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="total">Total</TabsTrigger>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="category">Category</TabsTrigger>
        <TabsTrigger value="country">Country</TabsTrigger>
      </TabsList>

      {/* PC View */}
      <div className="hidden md:block">
        <TabsContent value="total">
          <SummaryContent data={totalData.data} />
        </TabsContent>
        <TabsContent value="available">
          <SummaryContent data={availableData.data} />
        </TabsContent>
        <TabsContent value="category">
          <SummaryContent data={categoryData.data} />
        </TabsContent>
        <TabsContent value="country">
          <SummaryContent data={countryData.data} />
        </TabsContent>
      </div>

      {/* Mobile View with Swiper */}
      <div className="block md:hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            const tabs = ['total', 'available', 'category', 'country']
            setActiveTab(tabs[swiper.activeIndex])
          }}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <SummaryContent data={totalData.data} />
          </SwiperSlide>
          <SwiperSlide>
            <SummaryContent data={availableData.data} />
          </SwiperSlide>
          <SwiperSlide>
            <SummaryContent data={categoryData.data} />
          </SwiperSlide>
          <SwiperSlide>
            <SummaryContent data={countryData.data} />
          </SwiperSlide>
        </Swiper>
      </div>
    </Tabs>
  )
}
