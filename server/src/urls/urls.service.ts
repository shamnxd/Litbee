import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import { nanoid } from 'nanoid';
import { ShortUrl, UrlDocument } from './schemas/url.schema';
import { CreateUrlDto } from './dto/create-url.dto';
import { URL_MESSAGES } from '../common/constants/messages';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(ShortUrl.name) private urlModel: Model<UrlDocument>,
  ) {}

  async create(dto: CreateUrlDto, userId: string): Promise<UrlDocument> {
    const shortCode = dto.customSlug || nanoid(7);
    const tags = dto.tags || [];

    const url = new this.urlModel({
      userId,
      longUrl: dto.longUrl,
      shortCode,
      tags,
    });
    return url.save();
  }

  async updateUrl(
    id: string,
    dto: Partial<CreateUrlDto>,
    userId: string,
  ): Promise<UrlDocument> {
    const updateData: Partial<ShortUrl> = {};
    if (dto.longUrl) updateData.longUrl = dto.longUrl;
    if (dto.customSlug) updateData.shortCode = dto.customSlug;
    if (dto.tags) updateData.tags = dto.tags;

    const updatedUrl = await this.urlModel
      .findOneAndUpdate(
        { _id: id, userId },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!updatedUrl) {
      throw new NotFoundException(URL_MESSAGES.ERRORS.NOT_FOUND);
    }
    return updatedUrl;
  }

  async deleteUrl(id: string, userId: string): Promise<void> {
    const result = await this.urlModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(URL_MESSAGES.ERRORS.NOT_FOUND);
    }
  }

  async findAllByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ urls: UrlDocument[]; total: number }> {
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
      this.urlModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.urlModel.countDocuments(query).exec(),
    ]);

    return { urls, total };
  }

  async findByCode(shortCode: string): Promise<UrlDocument> {
    const url = await this.urlModel.findOne({ shortCode }).exec();
    if (!url) {
      throw new NotFoundException(URL_MESSAGES.ERRORS.SHORT_URL_NOT_FOUND(shortCode));
    }
    url.clicks += 1;
    await url.save();
    return url;
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
    const existing = await this.urlModel.findOne(query).exec();
    return !existing;
  }
}
