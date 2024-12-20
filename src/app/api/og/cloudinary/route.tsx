// app/api/og/cloudinary/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface CloudinaryResource {
  public_id: string
  secure_url: string
}

interface CloudinarySearchResponse {
  resources: CloudinaryResource[]
}

interface CloudinaryUploadResponse extends CloudinaryResource {
  format: string
}

const FOLDER_NAME = 'xrpl-rich-list-summary/og'

function generateSignature(params: Record<string, any>, apiSecret: string): string {
  // パラメータをソート
  const sortedKeys = Object.keys(params).sort()
  
  // パラメータを文字列に変換
  const stringToSign = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&') + apiSecret

  // SHA-1ハッシュを生成
  return crypto.subtle.digest('SHA-1', new TextEncoder().encode(stringToSign))
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }) as unknown as string
}

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET

    if (!siteUrl || !cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing environment variables')
    }

    // OG画像のURLを生成
    const ogImageUrl = `${siteUrl}/api/og`

    // 現在の時刻から一意のパブリックIDを生成（YYYY-MM-DD-HH形式）
    const now = new Date()
    const filename = `${now.toISOString().slice(0, 13).replace('T', '-')}`
    const timestamp = Math.floor(Date.now() / 1000)

    // アップロードパラメータ
    const uploadParams = {
      public_id: filename,
      folder: FOLDER_NAME,
      overwrite: true,
      timestamp,
      api_key: apiKey,
    }

    const signature = await generateSignature(uploadParams, apiSecret)

    // FormDataの作成
    const formData = new FormData()
    formData.append('file', ogImageUrl)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('folder', FOLDER_NAME)
    formData.append('public_id', filename)
    formData.append('overwrite', 'true')

    // Cloudinaryへアップロード
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    ).then(res => res.json()) as CloudinaryUploadResponse

    // 古い画像の削除は非同期で行う
    fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
        },
        body: JSON.stringify({
          expression: `folder:${FOLDER_NAME} AND resource_type:image`,
          sort_by: [{ created_at: 'desc' }],
          max_results: 30,
        }),
      }
    )
    .then(res => res.json() as Promise<CloudinarySearchResponse>)
    .then(({ resources }) => {
      // 現在のファイル以外の古い画像を削除
      return Promise.all(
        resources
          .filter(image => image.public_id !== `${FOLDER_NAME}/${filename}`)
          .map(image => 
            fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
                },
                body: JSON.stringify({
                  public_id: image.public_id,
                  timestamp,
                  api_key: apiKey,
                  signature: generateSignature({ public_id: image.public_id, timestamp }, apiSecret),
                }),
              }
            )
          )
      )
    })
    .catch(error => {
      console.error('Error cleaning up old images:', error)
    })

    return NextResponse.redirect(uploadResponse.secure_url, { status: 307 })
  } catch (error) {
    console.error('Error handling OG image:', error)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    return NextResponse.redirect(`${siteUrl}/api/og`, { status: 307 })
  }
}