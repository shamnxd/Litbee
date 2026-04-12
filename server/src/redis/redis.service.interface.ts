export const I_REDIS_SERVICE = 'IRedisService';

export interface IRedisService {
  set(key: string, value: string, expiryInSeconds?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
}
