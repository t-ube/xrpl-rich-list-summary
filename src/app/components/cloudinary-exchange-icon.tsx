// src/app/components/cloudinary-exchange-icon.tsx
'use client'

import { SquareDashed } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

interface ExchangeIconProps {
  exchange: string
  size?: number
}

export const EXCHANGE_ICONS: Record<string, string> = {
  'Binance': 'exchange-icons/binance-svgrepo-com',
  'Bitfinex': 'exchange-icons/bitfinex-v2-svgrepo-com',
  'Kraken': 'exchange-icons/kraken-svgrepo-com',
  'Bitstamp': 'exchange-icons/bitstamp-svgrepo-com',
  'Huobi': 'exchange-icons/huobi',
  'KuCoin': 'exchange-icons/kucoin-svgrepo-com',
  'Coinbase': 'exchange-icons/coinbase-v2-svgrepo-com',
  'UPbit': 'exchange-icons/upbit',
  'OKX': 'exchange-icons/okx-1',
  'Ripple': 'exchange-icons/ripple-2-logo-svgrepo-com',
  'Bitrue': 'exchange-icons/bitrue-svgrepo-com',
  'Gemini': 'exchange-icons/gemini-svgrepo-com',
  'Bybit': 'exchange-icons/bybit-svgrepo-com',
  'Yobit': 'exchange-icons/yobit-svgrepo-com',
  'Uphold': 'exchange-icons/uphold-svgrepo-com',
  'Bithumb': 'exchange-icons/bithumb',
  'eToro': 'exchange-icons/etoro-logo',
  'Coinone': 'exchange-icons/coinone-2',
  'Robinhood': 'exchange-icons/robinhood-svgrepo-com',
  'Korbit': 'exchange-icons/korbit',
  'Bitkub': 'exchange-icons/bitkub',
  'Gate.io': 'exchange-icons/gate1',
  'SwissBorg': 'exchange-icons/swissborg',
  'Wirex': 'exchange-icons/Wirex_idRZLQ24WL_0',
  'Paribu': 'exchange-icons/Paribu-Icon',
  'Crypto.com': 'exchange-icons/crypto.com-logo',
  'gatehub': 'exchange-icons/gatehub-svgrepo-com',
  'Mercado Bitcoin': 'exchange-icons/mercado@logotyp.us',
  'CoinDCX': 'exchange-icons/coindcx-svgrepo-com',
  'ZebPay': 'exchange-icons/Zebpay--Streamline-Simple-Icons',
  'BITPoint': 'exchange-icons/bitpoint-seeklogo',
  'Bitget Global': 'exchange-icons/bitget-token-new-bgb-logo',
  'GMO Coin': 'exchange-icons/gmo-1',
  'DMM Bitcoin': 'exchange-icons/dmm-bitcoin-1',
  'bitFlyer': 'exchange-icons/bitflyer',
  'Coincheck': 'exchange-icons/coincheck',
  'bitbank': 'exchange-icons/bitbank',
  'SBI VC Trade': 'exchange-icons/sbivct',
  'Firi': 'exchange-icons/firi',
  'CoinJar': 'exchange-icons/coinjar',
  'VALR': 'exchange-icons/Valr',
  'Coinhako': 'exchange-icons/coinhako.com',
  'BTC Markets': 'exchange-icons/btcmarkets',
  'MEXC': 'exchange-icons/mexc-logo',
  'Luno': 'exchange-icons/luno.com',
  'Phemex': 'exchange-icons/phemex-svgrepo-com',
  'Bitso': 'exchange-icons/Bitso_id2rgeRBwP_0',
  'Root Network': 'exchange-icons/rootnetwork',
  'Bitlo': 'exchange-icons/com.bitlo.bitloandroid',
  'BitForex': 'exchange-icons/bitforex-1',
  'HitBTC': 'exchange-icons/hitbtc-logo',
  'WhiteBIT': 'exchange-icons/WB_1line_Logo_Black',
  'ProBit': 'exchange-icons/ProBit_Global_Logo_vertical_Color_RGB',
  'LBank': 'exchange-icons/lbank-2',
  'Coinmotion': 'exchange-icons/coinmotion_full_square',
  'CoinSpot': 'exchange-icons/coinspot-1',
  'Nexo': 'exchange-icons/nexo-svgrepo-com',
  'CoinCola': 'exchange-icons/coincola.com',
  'MAX Exchange': 'exchange-icons/max-exchange-logo',
  'BitMart': 'exchange-icons/bitmart',
  'CEX.IO': 'exchange-icons/cexio',
  'BloFin': 'exchange-icons/blofin',
  'TradeOgre': 'exchange-icons/tradeogre',
  'CoinCatch': 'exchange-icons/coincatch',
  'GOPAX': 'exchange-icons/gopax',
  'Bitladon': 'exchange-icons/bitladon',
  'Bitpanda': 'exchange-icons/bitpanda-v2-svgrepo-com',
  'SunCrypto': 'exchange-icons/suncrypto',
  'Deribit': 'exchange-icons/deribit-svgrepo-com',
  'Bitvavo': 'exchange-icons/bitvavo-mark-black',
  'Currency.com': 'exchange-icons/Currency.com-logo',
  'Nobitex': 'exchange-icons/Nobitex-logo',
  'Chips.gg': 'exchange-icons/chipsgg_logo',
  'Flipster': 'exchange-icons/flipster',
  'Orionx': 'exchange-icons/orionx',
  'FixedFloat': 'exchange-icons/fixed-float-icon-darkbg',
  'Evernorth': 'exchange-icons/evernorth',
  'Flare Core Vault': 'exchange-icons/flare-core-vault',
  'XPR Bridge': 'exchange-icons/xpr-bridge',
  'Ceffu': 'exchange-icons/ceffu',
  'Doppler Finance': 'exchange-icons/doppler-finance',
  'Axelar Bridge': 'exchange-icons/axelar-bridge',
  'Xaman Service Fee': 'exchange-icons/xaman-service-fee',
  'XUMM': 'exchange-icons/xumm',
  'xrp.cafe': 'exchange-icons/xrp_cafe',
  'First Ledger': 'exchange-icons/first-ledger',
}

export function CloudinaryExchangeIcon({ exchange, size = 32 }: ExchangeIconProps) {
  const iconPath = EXCHANGE_ICONS[exchange]

  if (!iconPath) {
    return <SquareDashed size={size} className="text-gray-400" />
  }

  return (
    <CldImage
      src={iconPath}
      alt={`${exchange} icon`}
      width={size}
      height={size}
      format="auto"
      quality="auto"
      className="inline-block object-contain"
      style={{
        width: size,
        height: size
      }}
    />
  )
}