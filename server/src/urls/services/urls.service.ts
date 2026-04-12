import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { QueryFilter } from 'mongoose';
import { nanoid } from 'nanoid';
import { ShortUrl, UrlDocument } from '../schemas/url.schema';
import { CreateUrlDto } from '../dto/create-url.dto';
import { URL_MESSAGES } from '../../common/constants/messages';
import { UrlsMapper } from '../urls.mapper';
import type { IUrlsRepository } from '../interfaces/urls.repository.interface';
import { I_URLS_REPOSITORY } from '../constants/tokens';
import type { IUrlsService } from '../interfaces/urls.service.interface';
import type { UrlResponse } from '../dto/url-response.dto';

@Injectable()
export class UrlsService implements IUrlsService {
  constructor(
    @Inject(I_URLS_REPOSITORY)
    private readonly _urlsRepository: IUrlsRepository,
  ) { }

  async create(dto: CreateUrlDto, userId: string): Promise<{ message: string; data: UrlResponse }> {
    const shortCode = dto.customSlug || nanoid(7);
    const tags = dto.tags || [];

    const url = await this._urlsRepository.create({
      userId,
      longUrl: dto.longUrl,
      shortCode,
      tags,
    });
    return {
      message: URL_MESSAGES.SUCCESS.CREATED,
      data: UrlsMapper.toResponseDto(url),
    };
  }

  async updateUrl(
    id: string,
    dto: Partial<CreateUrlDto>,
    userId: string,
  ): Promise<{ message: string; data: UrlResponse }> {
    const updateData: Partial<ShortUrl> = {};
    if (dto.longUrl) updateData.longUrl = dto.longUrl;
    if (dto.customSlug) updateData.shortCode = dto.customSlug;
    if (dto.tags) updateData.tags = dto.tags;

    const updatedUrl = await this._urlsRepository.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
    );

    if (!updatedUrl) {
      throw new NotFoundException(URL_MESSAGES.ERRORS.NOT_FOUND);
    }
    return {
      message: URL_MESSAGES.SUCCESS.UPDATED,
      data: UrlsMapper.toResponseDto(updatedUrl),
    };
  }

  async deleteUrl(id: string, userId: string): Promise<{ message: string }> {
    const isDeleted = await this._urlsRepository.deleteOne({ _id: id, userId });
    if (!isDeleted) {
      throw new NotFoundException(URL_MESSAGES.ERRORS.NOT_FOUND);
    }
    return { message: URL_MESSAGES.SUCCESS.DELETED };
  }

  async findAllByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ count: number; data: UrlResponse[] }> {
    const query: QueryFilter<UrlDocument> = { userId };

    if (search) {
      query.$or = [
        { longUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { 'tags.name': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [urls, total] = await Promise.all([
      this._urlsRepository.find(query, skip, limit, { createdAt: -1 }),
      this._urlsRepository.countDocuments(query),
    ]);

    return {
      count: total,
      data: UrlsMapper.toResponseDtoArray(urls),
    };
  }

  async findByCode(shortCode: string): Promise<UrlResponse> {
    const url = await this._urlsRepository.findOne({ shortCode });
    if (!url) {
      throw new NotFoundException(
        URL_MESSAGES.ERRORS.SHORT_URL_NOT_FOUND(shortCode),
      );
    }

    const updatedUrl = await this._urlsRepository.findByIdAndUpdate(
      url._id.toString(),
      { $inc: { clicks: 1 } },
    );

    return UrlsMapper.toResponseDto(updatedUrl || url);
  }

  async checkSlugAvailability(
    shortCode: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: QueryFilter<UrlDocument> & { _id?: { $ne: string } } = {
      shortCode,
    };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await this._urlsRepository.findOne(query);
    return !existing;
  }
}
