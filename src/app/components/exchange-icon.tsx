// src/app/components/exchange-icon.tsx
'use client'

import Image from 'next/image'
import { SquareDashed } from 'lucide-react'

interface ExchangeIconProps {
  exchange: string
  size?: number
}

const EXCHANGE_ICONS: Record<string, string> = {
  'Binance': '/exchange-icons/binance-svgrepo-com.svg',
  'Bitfinex': '/exchange-icons/bitfinex-v2-svgrepo-com.svg',
  'Kraken': '/exchange-icons/kraken-svgrepo-com.svg',
  'Bitstamp': '/exchange-icons/bitstamp-svgrepo-com.svg',
  'Huobi': '/exchange-icons/huobi.svg',
  'KuCoin': '/exchange-icons/kucoin-svgrepo-com.svg',
  'Coinbase': '/exchange-icons/coinbase-v2-svgrepo-com.svg',
  'UPbit': '/exchange-icons/upbit.svg',
  'OKX': '/exchange-icons/okx-1.svg',
  'Ripple': '/exchange-icons/ripple-2-logo-svgrepo-com.svg',
  'Bitrue': '/exchange-icons/bitrue-svgrepo-com.svg',
  'Gemini': '/exchange-icons/gemini-svgrepo-com.svg',
  'Bybit' : '/exchange-icons/bybit-svgrepo-com.svg',
  'Yobit' : '/exchange-icons/yobit-svgrepo-com.svg',
  'Uphold' : '/exchange-icons/uphold-svgrepo-com.svg',
  'Bithumb' : '/exchange-icons/bithumb.svg',
  'eToro' : '/exchange-icons/etoro-logo.svg',
  'Coinone' : '/exchange-icons/coinone-2.svg',
  'Robinhood' : '/exchange-icons/robinhood-svgrepo-com.svg',
  'Korbit' : '/exchange-icons/korbit.svg',
  'Bitkub' : '/exchange-icons/bitkub.svg',
  'Gate.io' : '/exchange-icons/gate1.svg',
  'SwissBorg' : '/exchange-icons/swissborg.svg',
  'Wirex' : '/exchange-icons/Wirex_idRZLQ24WL_0.svg',
  'Paribu' : '/exchange-icons/Paribu-Icon.svg',
  'Crypto.com' : '/exchange-icons/crypto.com-logo.svg',
  'gatehub' : '/exchange-icons/gatehub-svgrepo-com.svg',
  'Mercado Bitcoin' : '/exchange-icons/mercado@logotyp.us.svg',
  'CoinDCX' : '/exchange-icons/coindcx-svgrepo-com.svg',
  'ZebPay' : '/exchange-icons/Zebpay--Streamline-Simple-Icons.svg',
  'BITPoint' : '/exchange-icons/bitpoint-seeklogo.svg',
  'Bitget Global' : '/exchange-icons/bitget-token-new-bgb-logo.svg',
  'GMO Coin' : '/exchange-icons/gmo-1.svg',
  'DMM Bitcoin' : '/exchange-icons/dmm-bitcoin-1.svg',
  'bitFlyer' : '/exchange-icons/bitflyer.svg',
  'Coincheck' : '/exchange-icons/coincheck.svg',
  'bitbank' : '/exchange-icons/bitbank.svg',
  'SBI VC Trade' : '/exchange-icons/sbivct.jpeg',
  'Firi' : '/exchange-icons/firi.png',
  'CoinJar' : '/exchange-icons/coinjar.svg',
  'VALR' : '/exchange-icons/Valr.svg',
  'Coinhako' : '/exchange-icons/coinhako.com.svg',
  'BTC Markets' : '/exchange-icons/btcmarkets.svg',
  'MEXC' : '/exchange-icons/mexc-logo.svg',
  'Luno' : '/exchange-icons/luno.com.svg',
  'Phemex' : '/exchange-icons/phemex-svgrepo-com.svg',
  'Bitso' : '/exchange-icons/Bitso_id2rgeRBwP_0.svg',
  'Root Network' : '/exchange-icons/rootnetwork.png',
  'Bitlo' : '/exchange-icons/com.bitlo.bitloandroid.png',
  'BitForex' : '/exchange-icons/bitforex-1.svg',
  'HitBTC' : '/exchange-icons/hitbtc-logo.svg',
  'WhiteBIT' : '/exchange-icons/WB_1line_Logo_Black.svg',
  'ProBit' : '/exchange-icons/ProBit_Global_Logo_vertical_Color_RGB.png',
  'LBank' : '/exchange-icons/lbank-2.svg',
  'Coinmotion' : '/exchange-icons/coinmotion_full_square.png',
  'CoinSpot' : '/exchange-icons/coinspot-1.svg',
  'Nexo' : '/exchange-icons/nexo-svgrepo-com.svg',
  'CoinCola' : '/exchange-icons/coincola.com.svg',
  'MAX Exchange' : '/exchange-icons/max-exchange-logo.svg',
  'BitMart' : '/exchange-icons/bitmart.svg',
  'CEX.IO' : '/exchange-icons/cexio.svg',
  'BloFin' : '/exchange-icons/blofin.jpg',
  'TradeOgre' : '/exchange-icons/tradeogre.png',
  'CoinCatch' : '/exchange-icons/coincatch.png',
  'GOPAX' : '/exchange-icons/gopax.png',
  'Bitladon' : '/exchange-icons/bitladon.svg',
  'Bitpanda' : '/exchange-icons/bitpanda-v2-svgrepo-com.svg',
  'SunCrypto' : '/exchange-icons/suncrypto.jpg',
  'Deribit' : '/exchange-icons/deribit-svgrepo-com.svg',
  'Bitvavo' : '/exchange-icons/bitvavo-mark-black.svg',
  'Currency.com' : '/exchange-icons/Currency.com-logo.svg',
  'Nobitex' : '/exchange-icons/Nobitex-logo.png',
  'Chips.gg' : '/exchange-icons/chipsgg_logo.jpg',
  'Flipster' : '/exchange-icons/flipster.png',
  'Orionx' : '/exchange-icons/orionx.jpg',
  'FixedFloat' : '/exchange-icons/fixed-float-icon-darkbg.svg'
}

export function ExchangeIcon({ exchange, size = 32 }: ExchangeIconProps) {
  const iconPath = EXCHANGE_ICONS[exchange]

  if (!iconPath) {
    return <SquareDashed size={size} className="text-gray-400" />
  }

  return (
    <Image
      src={iconPath}
      alt={`${exchange} icon`}
      width={size}
      height={size}
      className="inline-block"
      style={{
        minWidth: size,
        minHeight: size
      }}
    />
  )
}