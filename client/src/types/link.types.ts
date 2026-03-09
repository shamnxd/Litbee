export interface LinkItem {
    id: string;
    shortUrl: string;
    longUrl: string;
    clicks: number;
    icon: string;
    tags: Array<{ name: string; color: string }>;
    expired?: boolean;
}

export interface RawUrlItem {
    _id: string;
    shortCode: string;
    longUrl: string;
    clicks: number;
    tags: Array<{ name: string; color: string }>;
}

export interface CreateUrlDto {
    longUrl: string;
    customSlug?: string;
    tags?: Array<{ name: string; color: string }>;
}
