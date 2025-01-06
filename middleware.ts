// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // OG画像生成エンドポイントのパスのみを対象とする
  if (request.nextUrl.pathname.startsWith('/api/og/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('X-Robots-Tag', 'noarchive')
    return response
  }

  // その他のリクエストは通常通り処理
  return NextResponse.next()
}

export const config = {
  matcher: '/api/og/:path*',
}