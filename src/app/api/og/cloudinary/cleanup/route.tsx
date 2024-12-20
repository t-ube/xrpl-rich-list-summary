// app/api/og/cloudinary/cleanup/route.ts
import { NextResponse } from 'next/server'
import type { CloudinaryListResponse, CloudinaryResource } from '@/types/cloudinary'

const FOLDER_NAME = 'xrp-rich-list-summary/og'

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing environment variables')
    }

    const timestamp = Math.floor(Date.now() / 1000)

    // 画像リストの取得
    const listResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${FOLDER_NAME}&max_results=100`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`
        }
      }
    )

    if (!listResponse.ok) {
      throw new Error('Failed to fetch resources')
    }

    const resources = (await listResponse.json()) as CloudinaryListResponse
    const currentDate = new Date()
    const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)

    // 古い画像の削除
    const deletePromises = resources.resources
      .filter((resource: CloudinaryResource) => {
        const createdAt = new Date(resource.created_at)
        return createdAt < oneDayAgo
      })
      .map(async (resource: CloudinaryResource) => {
        const deleteParams = {
          public_id: resource.public_id,
          timestamp
        }
        const deleteSignature = await generateSignature(deleteParams, apiSecret)

        const formData = new FormData()
        formData.append('public_id', resource.public_id)
        formData.append('timestamp', timestamp.toString())
        formData.append('api_key', apiKey)
        formData.append('signature', deleteSignature)

        return fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: 'POST',
            body: formData
          }
        )
      })

    await Promise.all(deletePromises)
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error cleaning up old images:', error)
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// パラメータの型定義
type SignatureParams = Record<string, string | number | boolean>

// 署名生成関数
async function generateSignature(params: SignatureParams, apiSecret: string): Promise<string> {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')

  const messageData = new TextEncoder().encode(sortedParams + apiSecret)
  const hashBuffer = await crypto.subtle.digest('SHA-1', messageData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}