import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { IRedisService } from './redis.service.interface';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy, IRedisService {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) { }

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl) {
      this.redis = new Redis(redisUrl);
    } else {
      this.redis = new Redis();
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async set(key: string, value: string, expiryInSeconds?: number) {
    if (expiryInSeconds) {
      await this.redis.set(key, value, 'EX', expiryInSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
