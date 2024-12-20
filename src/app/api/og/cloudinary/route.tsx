// app/api/og/cloudinary/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const FOLDER_NAME = 'xrp-rich-list-summary/og'

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!siteUrl || !cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing environment variables')
    }

    // OG画像のURLを生成
    const ogImageUrl = `${siteUrl}/api/og`
    const now = new Date()
    const timestamp = Math.floor(Date.now() / 1000)
    const filename = `${now.toISOString().slice(0, 13).replace('T', '-')}`

    // アップロードパラメータの準備
    const params = {
      public_id: filename,
      folder: FOLDER_NAME,
      overwrite: true,
      timestamp
    }

    // 署名の生成
    const signature = await generateSignature(params, apiSecret)

    // FormDataの構築
    const formData = new FormData()
    formData.append('file', ogImageUrl)
    formData.append('timestamp', timestamp.toString())
    formData.append('public_id', filename)
    formData.append('folder', FOLDER_NAME)
    formData.append('overwrite', 'true')
    formData.append('api_key', apiKey)
    formData.append('signature', signature)

    // Cloudinary APIへの直接リクエスト
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${await uploadResponse.text()}`)
    }

    const result = await uploadResponse.json()

    // クリーンアップを非同期で実行
    fetch('/api/og/cloudinary/cleanup')
    .catch(error => {
      console.error('Cleanup error:', error)
    })
    
    return NextResponse.redirect(result.secure_url, { status: 307 })

  } catch (error) {
    console.error('Error handling OG image:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

// Cloudinary API署名の生成
async function generateSignature(params: Record<string, any>, apiSecret: string): Promise<string> {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')

  const messageData = new TextEncoder().encode(sortedParams + apiSecret)
  const hashBuffer = await crypto.subtle.digest('SHA-1', messageData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}