import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { ShortUrl, UrlSchema } from './schemas/url.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ShortUrl.name, schema: UrlSchema }]),
    ],
    providers: [UrlsService],
    controllers: [UrlsController],
})
export class UrlsModule { }
