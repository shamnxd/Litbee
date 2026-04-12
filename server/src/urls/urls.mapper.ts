import { UrlDocument } from './schemas/url.schema';

export class UrlsMapper {
  static toResponseDto(url: UrlDocument) {
    return {
      id: url._id.toString(),
      longUrl: url.longUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      tags: url.tags,
      createdAt: url.createdAt.toISOString(),
      updatedAt: url.updatedAt.toISOString(),
    };
  }

  static toResponseDtoArray(urls: UrlDocument[]) {
    return urls.map((url) => this.toResponseDto(url));
  }
}
