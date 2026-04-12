import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortUrl, UrlDocument } from '../schemas/url.schema';
import { IUrlsRepository } from '../interfaces/urls.repository.interface';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class UrlsRepository
  extends BaseRepository<UrlDocument>
  implements IUrlsRepository
{
  constructor(@InjectModel(ShortUrl.name) urlModel: Model<UrlDocument>) {
    super(urlModel);
  }
}
