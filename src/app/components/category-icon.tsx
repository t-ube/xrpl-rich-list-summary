// src/app/components/category-icon.tsx
'use client'

import {
  Stars,
  HelpCircle,
  Building2,
  User,
  Briefcase,
  Dice5,
  Wallet,
  BarChart3,
  Gamepad2,
  LineChart
} from "lucide-react"

interface CategoryIconProps {
  category: string
}

export function CategoryIcon ( { category } : CategoryIconProps ) {
  const iconProps = { 
    className: "w-5 h-5", 
    strokeWidth: 1.5 
  }

  switch (category) {
    case 'Major Contributor':
      return <Stars {...iconProps} className="w-5 h-5 text-purple-600" />
    case 'Exchange':
      return <Building2 {...iconProps} className="w-5 h-5 text-blue-600" />
    case 'Individual':
      return <User {...iconProps} className="w-5 h-5 text-green-600" />
    case 'Custody/Institution':
      return <Briefcase {...iconProps} className="w-5 h-5 text-orange-600" />
    case 'Casino/Gambling':
      return <Dice5 {...iconProps} className="w-5 h-5 text-red-600" />
    case 'Payment Service':
      return <Wallet {...iconProps} className="w-5 h-5 text-cyan-600" />
    case 'DeFi Protocol':
      return <BarChart3 {...iconProps} className="w-5 h-5 text-indigo-600" />
    case 'NFT/Gaming':
      return <Gamepad2 {...iconProps} className="w-5 h-5 text-pink-600" />
    case 'Trading Service':
      return <LineChart {...iconProps} className="w-5 h-5 text-yellow-600" />
    case 'Other':
    default:
      return <HelpCircle {...iconProps} className="w-5 h-5 text-gray-400" />
  }
}
