export interface UrlResponse {
  id: string;
  longUrl: string;
  shortCode: string;
  clicks: number;
  tags: { name: string; color: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface UrlsResponse {
  message?: string;
  data: UrlResponse | UrlResponse[];
}
