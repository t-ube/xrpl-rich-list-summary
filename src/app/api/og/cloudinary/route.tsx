// app/api/og/cloudinary/route.ts
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const FOLDER_NAME = 'xrpl-rich-list-summary/og'

interface CloudinaryAPIResponse {
  resources: Array<{
    public_id: string
    secure_url: string
    created_at: string
  }>
}

async function cloudinaryFetch(endpoint: string, options: RequestInit = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary credentials')
  }

  const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}`
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = await generateSignature(timestamp, apiSecret)

  const url = new URL(endpoint, baseUrl)
  url.searchParams.append('api_key', apiKey)
  url.searchParams.append('timestamp', timestamp.toString())
  url.searchParams.append('signature', signature)

  return fetch(url.toString(), {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  })
}

async function generateSignature(timestamp: number, apiSecret: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(`timestamp=${timestamp}${apiSecret}`)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function uploadImage(imageUrl: string, public_id: string) {
  const formData = new FormData()
  formData.append('file', imageUrl)
  formData.append('public_id', public_id)
  formData.append('folder', FOLDER_NAME)
  formData.append('overwrite', 'true')
  formData.append('format', 'png')

  const response = await cloudinaryFetch('/image/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  return response.json()
}

async function searchImages(expression: string) {
  const response = await cloudinaryFetch('/resources/search', {
    method: 'POST',
    body: JSON.stringify({
      expression,
      sort_by: [{ created_at: 'desc' }],
      max_results: 30,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to search images')
  }

  return response.json() as Promise<CloudinaryAPIResponse>
}

async function deleteImage(public_id: string) {
  const response = await cloudinaryFetch('/resources/image/upload', {
    method: 'DELETE',
    body: JSON.stringify({ public_id }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete image')
  }

  return response.json()
}

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) {
      throw new Error('NEXT_PUBLIC_SITE_URL is not defined')
    }

    // OG画像のURLを生成
    const ogImageUrl = `${siteUrl}/api/og`

    // 現在の時刻から一意のパブリックIDを生成（YYYY-MM-DD-HH形式）
    const now = new Date()
    const filename = `${now.toISOString().slice(0, 13).replace('T', '-')}`
    const public_id = `${FOLDER_NAME}/${filename}`

    // 既存の画像を検索
    const { resources } = await searchImages(`public_id:${public_id}`)

    let imageUrl

    if (resources && resources.length > 0) {
      // 既存の画像が見つかった場合はそれを使用
      imageUrl = resources[0].secure_url
    } else {
      // 新しい画像をアップロード
      const uploadResponse = await uploadImage(ogImageUrl, filename)
      imageUrl = uploadResponse.secure_url

      try {
        // 古い画像を検索
        const { resources: oldImages } = await searchImages(`folder:${FOLDER_NAME} AND resource_type:image`)

        // 現在のファイル以外の古い画像を削除
        await Promise.all(
          oldImages
            .filter(image => image.public_id !== public_id)
            .map(image => deleteImage(image.public_id))
        )
      } catch (error) {
        console.log('Error cleaning up old images:', error)
      }
    }

    return Response.redirect(imageUrl, 307)
  } catch (error) {
    console.error('Error handling OG image:', error)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    return Response.redirect(`${siteUrl}/api/og`, 307)
  }
}