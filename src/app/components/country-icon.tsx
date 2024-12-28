// src/app/components/country-icon.tsx
'use client'

import * as Flags from 'country-flag-icons/react/3x2'

interface CountryIconProps {
  country: string
}

// 国名から2文字コードへのマッピング
const countryToCode: { [key: string]: keyof typeof Flags } = {
  'United States': 'US',
  'South Korea': 'KR',
  'Cayman Islands': 'KY',
  'Japan': 'JP',
  'Singapore': 'SG',
  'Israel': 'IL',
  'Seychelles': 'SC',
  'Australia': 'AU',
  'British Virgin Islands': 'VG',
  'Turkey': 'TR',
  'Norway': 'NO',
  'Switzerland': 'CH',
  'India': 'IN',
  'Luxembourg': 'LU',
  'Thailand': 'TH',
  'United Kingdom': 'GB',
  'Brazil': 'BR',
  'Russia': 'RU',
  'Curacao': 'CW',
  'Mexico': 'MX',
  'Canada': 'CA',
  'Philippines': 'PH',
  'China': 'CN',
  'Netherlands': 'NL',
  'South Africa': 'ZA',
  'Hong Kong': 'HK',
  'Ukraine': 'UA',
  'Poland': 'PL',
  'Chile': 'CL',
  'Finland': 'FI',
  'Bulgaria': 'BG',
  'Austria': 'AT',
  'Lithuania': 'LT',
  'Bahrain': 'BH',
  'Iran': 'IR',
  'Indonesia': 'ID',
  'Vietnam': 'VN',
  'Belarus': 'BY',
  'Germany': 'DE',
  'Nigeria': 'NG',
  'UAE': 'AE',
  'Romania': 'RO',
  'Estonia': 'EE',
  'Taiwan': 'TW',
  'Dubai': 'AE',
  'Bahamas': 'BS'
}
  
export function CountryIcon ( { country } : CountryIconProps ) {
  if (country === 'Unknown') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-4 bg-gray-100 rounded">
        ❓
      </span>
    )
  }
  const code = countryToCode[country]
  if (code && Flags[code]) {
    const FlagComponent = Flags[code]
    return (
      <div className="inline-flex items-center justify-center w-6 h-4">
        <FlagComponent />
      </div>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-4 bg-gray-100 rounded">
      🏳️
    </span>
  )
}
