import { CreateUrlDto } from '../dto/create-url.dto';
import { UrlResponse } from '../dto/url-response.dto';

export interface IUrlsService {
  create(dto: CreateUrlDto, userId: string): Promise<{ message: string; data: UrlResponse }>;
  updateUrl(
    id: string,
    dto: Partial<CreateUrlDto>,
    userId: string,
  ): Promise<{ message: string; data: UrlResponse }>;
  deleteUrl(id: string, userId: string): Promise<{ message: string }>;
  findAllByUser(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<{ count: number; data: UrlResponse[] }>;
  findByCode(shortCode: string): Promise<UrlResponse>;
  checkSlugAvailability(
    shortCode: string,
    excludeId?: string,
  ): Promise<boolean>;
}
