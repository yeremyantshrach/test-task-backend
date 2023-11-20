import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@/settings/config';

export const cacheManagerFactory = (
  configService: ConfigService<IAppConfig, true>,
): CacheModuleOptions<RedisClientOptions> => {
  const host = configService.get<string>('redis.host', { infer: true });
  const port = configService.get<string>('redis.port', { infer: true });
  return {
    isGlobal: true,
    ttl: 60,
    max: 10,
    store: redisStore,
    url: `redis://${host}:${port}`,
  };
};
