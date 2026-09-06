// src/app/components/cloudflare-exchange-icon.tsx
'use client'

import { SquareDashed } from 'lucide-react'

interface ExchangeIconProps {
  exchange: string
  size?: number
}

const ICON_BASE = 'https://rich-icons.shirome.net'

export const EXCHANGE_ICONS: Record<string, string> = {
  'Binance': 'binance-svgrepo-com.svg',
  'Bitfinex': 'bitfinex-v2-svgrepo-com.svg',
  'Kraken': 'kraken-svgrepo-com.svg',
  'Bitstamp': 'bitstamp-svgrepo-com.svg',
  'Huobi': 'huobi.svg',
  'KuCoin': 'kucoin-svgrepo-com.svg',
  'Coinbase': 'coinbase-v2-svgrepo-com.svg',
  'UPbit': 'upbit.svg',
  'OKX': 'okx-1.svg',
  'Ripple': 'ripple-2-logo-svgrepo-com.svg',
  'Bitrue': 'bitrue-svgrepo-com.svg',
  'Gemini': 'gemini-svgrepo-com.svg',
  'Bybit' : 'bybit-svgrepo-com.svg',
  'Yobit' : 'yobit-svgrepo-com.svg',
  'Uphold' : 'uphold-svgrepo-com.svg',
  'Bithumb' : 'bithumb.svg',
  'eToro' : 'etoro-logo.svg',
  'Coinone' : 'coinone-2.svg',
  'Robinhood' : 'robinhood-svgrepo-com.svg',
  'Korbit' : 'korbit.svg',
  'Bitkub' : 'bitkub.svg',
  'Gate.io' : 'gate1.svg',
  'SwissBorg' : 'swissborg.svg',
  'Wirex' : 'Wirex_idRZLQ24WL_0.svg',
  'Paribu' : 'Paribu-Icon.svg',
  'Crypto.com' : 'crypto.com-logo.svg',
  'gatehub' : 'gatehub-svgrepo-com.svg',
  'Mercado Bitcoin' : 'mercado@logotyp.us.svg',
  'CoinDCX' : 'coindcx-svgrepo-com.svg',
  'ZebPay' : 'Zebpay--Streamline-Simple-Icons.svg',
  'BITPoint' : 'bitpoint-seeklogo.svg',
  'Bitget Global' : 'bitget-token-new-bgb-logo.svg',
  'GMO Coin' : 'gmo-1.svg',
  'DMM Bitcoin' : 'dmm-bitcoin-1.svg',
  'bitFlyer' : 'bitflyer.svg',
  'Coincheck' : 'coincheck.svg',
  'bitbank' : 'bitbank.svg',
  'SBI VC Trade' : 'sbivct.jpeg',
  'Firi' : 'firi.png',
  'CoinJar' : 'coinjar.svg',
  'VALR' : 'Valr.svg',
  'Coinhako' : 'coinhako.com.svg',
  'BTC Markets' : 'btcmarkets.svg',
  'MEXC' : 'mexc-logo.svg',
  'Luno' : 'luno.com.svg',
  'Phemex' : 'phemex-svgrepo-com.svg',
  'Bitso' : 'Bitso_id2rgeRBwP_0.svg',
  'Root Network' : 'rootnetwork.png',
  'Bitlo' : 'com.bitlo.bitloandroid.png',
  'BitForex' : 'bitforex-1.svg',
  'HitBTC' : 'hitbtc-logo.svg',
  'WhiteBIT' : 'WB_1line_Logo_Black.svg',
  'ProBit' : 'ProBit_Global_Logo_vertical_Color_RGB.png',
  'LBank' : 'lbank-2.svg',
  'Coinmotion' : 'coinmotion_full_square.png',
  'CoinSpot' : 'coinspot-1.svg',
  'Nexo' : 'nexo-svgrepo-com.svg',
  'CoinCola' : 'coincola.com.svg',
  'MAX Exchange' : 'max-exchange-logo.svg',
  'BitMart' : 'bitmart.svg',
  'CEX.IO' : 'cexio.svg',
  'BloFin' : 'blofin.jpg',
  'TradeOgre' : 'tradeogre.png',
  'CoinCatch' : 'coincatch.png',
  'GOPAX' : 'gopax.png',
  'Bitladon' : 'bitladon.svg',
  'Bitpanda' : 'bitpanda-v2-svgrepo-com.svg',
  'SunCrypto' : 'suncrypto.jpg',
  'Deribit' : 'deribit-svgrepo-com.svg',
  'Bitvavo' : 'bitvavo-mark-black.svg',
  'Currency.com' : 'Currency.com-logo.svg',
  'Nobitex' : 'Nobitex-logo.png',
  'Chips.gg' : 'chipsgg_logo.jpg',
  'Flipster' : 'flipster.png',
  'Orionx' : 'orionx.jpg',
  'FixedFloat' : 'fixed-float-icon-darkbg.svg',
  'Evernorth': 'evernorth.png',
  'Flare Core Vault': 'flare-core-vault.ico',
  'XPR Bridge': 'xpr-bridge.png',
  'Ceffu': 'ceffu.ico',
  'Doppler Finance': 'doppler-finance.jpg',
  'Axelar Bridge': 'axelar-bridge.png',
  'Xaman Service Fee': 'xaman-service-fee.png',
  'XUMM': 'xumm.png',
  'xrp.cafe': 'xrp_cafe.png',
  'First Ledger': 'first-ledger.png',
}

export function CloudflareExchangeIcon({ exchange, size = 32 }: ExchangeIconProps) {
  const iconPath = EXCHANGE_ICONS[exchange];

  if (!iconPath) {
    return <SquareDashed size={size} className="text-gray-400" aria-hidden="true" />
  }

  return (
    <img
      src={`${ICON_BASE}/${iconPath}`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="inline-block object-contain"
      style={{
        width: size,
        height: size
      }}
    />
  )
}