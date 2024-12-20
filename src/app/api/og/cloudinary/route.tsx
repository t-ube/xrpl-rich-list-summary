// app/api/og/cloudinary/route.ts
import { v2 as cloudinary } from 'cloudinary'

interface CloudinaryResource {
  public_id: string
  secure_url: string
  created_at: string
}

interface CloudinarySearchResponse {
  resources: CloudinaryResource[]
  total_count: number
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

const FOLDER_NAME = 'xrpl-rich-list-summary/og'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // OG画像のURLを生成
    const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`

    // 現在の時刻から一意のパブリックIDを生成（YYYY-MM-DD-HH形式）
    const now = new Date()
    const filename = `${now.toISOString().slice(0, 13).replace('T', '-')}`
    const public_id = `${FOLDER_NAME}/${filename}`

    // 既存の画像を検索
    const { resources } = await cloudinary.search
      .expression(`public_id:${public_id}`)
      .execute() as CloudinarySearchResponse

    let imageUrl

    if (resources && resources.length > 0) {
      // 既存の画像が見つかった場合はそれを使用
      imageUrl = resources[0].secure_url
    } else {
      // 新しい画像をアップロード
      const uploadResponse = await cloudinary.uploader.upload(ogImageUrl, {
        folder: FOLDER_NAME,
        public_id: filename,
        overwrite: true,
        format: 'png'
      })
      imageUrl = uploadResponse.secure_url

      // 2時間以上前の古い画像を削除
      const twoHoursAgo = new Date(now)
      twoHoursAgo.setHours(now.getHours() - 2)
      
      try {
        const { resources: oldImages } = await cloudinary.search
          .expression(`folder:${FOLDER_NAME} AND resource_type:image`)
          .sort_by('created_at', 'desc')
          .execute() as CloudinarySearchResponse

        // 現在のファイル以外の古い画像を削除
        const deletionPromises = oldImages
          .filter(image => image.public_id !== public_id)
          .map(image => cloudinary.uploader.destroy(image.public_id))

        await Promise.all(deletionPromises)
      } catch (error) {
        console.log('Error cleaning up old images:', error)
      }
    }

    return Response.redirect(imageUrl, 307)
  } catch (error) {
    console.error('Error handling OG image:', error)
    // エラーの場合は元のOG画像生成APIにフォールバック
    return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/api/og`, 307)
  }
}