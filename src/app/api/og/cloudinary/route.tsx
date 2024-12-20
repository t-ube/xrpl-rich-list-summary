// app/api/og/cloudinary/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface CloudinaryResource {
  public_id: string
  secure_url: string
}

interface SignatureParams {
  [key: string]: string | number | boolean
}

const FOLDER_NAME = 'xrp-rich-list-summary/og'

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!siteUrl || !cloudName || !apiKey || !apiSecret) {
      console.error('Error: Missing environment variables')
      throw new Error('Missing environment variables')
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    // OG画像のURLを生成
    const ogImageUrl = `${siteUrl}/api/og`

    // 現在の時刻から一意のパブリックIDを生成（YYYY-MM-DD-HH形式）
    const now = new Date()
    const filename = `${now.toISOString().slice(0, 13).replace('T', '-')}`
    const timestamp = Math.floor(Date.now() / 1000)

    // アップロードパラメータ
    const params: SignatureParams = {
      public_id: filename,
      folder: FOLDER_NAME,
      overwrite: true,
      timestamp: timestamp,
    }

    // Cloudinaryへアップロード
    const uploadResponse = await cloudinary.uploader.upload(ogImageUrl, params)

    // 古い画像の削除は非同期で行う
    cloudinary.api.resources({
      type: 'upload',
      prefix: FOLDER_NAME,
      max_results: 100,
    })
    .then(result => {
      const resources = result.resources
      // 現在のファイル以外の古い画像を削除
      const deletePromises = resources
        .filter((image: CloudinaryResource) => image.public_id !== `${FOLDER_NAME}/${filename}`)
        .map((image: CloudinaryResource) => cloudinary.uploader.destroy(image.public_id))
      return Promise.all(deletePromises)  
    })
    .catch(error => {
      console.error('Error cleaning up old images:', error)
    })

    return NextResponse.redirect(uploadResponse.secure_url, { status: 307 })
  } catch (error) {
    console.error('Error handling OG image:', error)
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }), 
      { 
        status: 500, 
        statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json'
        }  
      }
    )
  }
}