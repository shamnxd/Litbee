import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlsService } from './services/urls.service';
import { UrlsController } from './urls.controller';
import { ShortUrl, UrlSchema } from './schemas/url.schema';
import { UrlsRepository } from './repositories/urls.repository';
import { I_URLS_REPOSITORY } from './interfaces/urls.repository.interface';
import { I_URLS_SERVICE } from './interfaces/urls.service.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ShortUrl.name, schema: UrlSchema }]),
  ],
  providers: [
    {
      provide: I_URLS_SERVICE,
      useClass: UrlsService,
    },
    {
      provide: I_URLS_REPOSITORY,
      useClass: UrlsRepository,
    },
  ],
  controllers: [UrlsController],
  exports: [I_URLS_SERVICE],
})
export class UrlsModule {}
