import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { ShortUrl, UrlDocument } from './schemas/url.schema';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlsService {
    constructor(
        @InjectModel(ShortUrl.name) private urlModel: Model<UrlDocument>,
    ) { }

    async create(dto: CreateUrlDto, userId: string): Promise<UrlDocument> {
        const shortCode = nanoid(7);
        const url = new this.urlModel({
            userId,
            longUrl: dto.longUrl,
            shortCode,
        });
        return url.save();
    }

    async findAllByUser(userId: string): Promise<UrlDocument[]> {
        return this.urlModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }

    async findByCode(shortCode: string): Promise<UrlDocument> {
        const url = await this.urlModel.findOne({ shortCode }).exec();
        if (!url) {
            throw new NotFoundException(`Short URL '${shortCode}' not found`);
        }
        // Increment click count
        url.clicks += 1;
        await url.save();
        return url;
    }
}
