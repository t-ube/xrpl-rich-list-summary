// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // OG画像生成エンドポイントのパスのみを対象とする
  if (request.nextUrl.pathname.startsWith('/api/og/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=3600')
    return response
  }

  // その他のリクエストは通常通り処理
  return NextResponse.next()
}

export const config = {
  matcher: '/api/og/:path*',
}