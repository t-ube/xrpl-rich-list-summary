// types/cloudinary.ts
export interface CloudinaryResource {
  public_id: string
  created_at: string
}

export interface CloudinaryListResponse {
  resources: CloudinaryResource[]
}