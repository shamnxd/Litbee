import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { I_REDIS_SERVICE } from './redis.service.interface';

@Global()
@Module({
  providers: [
    {
      provide: I_REDIS_SERVICE,
      useClass: RedisService,
    },
  ],
  exports: [I_REDIS_SERVICE],
})
export class RedisModule {}
