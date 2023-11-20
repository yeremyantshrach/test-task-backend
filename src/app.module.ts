import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { RequestContextService } from '@/common/services';
import { TypeOrmConfigService } from '@/common/typeorm';
import { winstonModuleFactory } from '@/common/factories/winston-module.factory';
import { cacheManagerFactory } from '@/common/factories/cache-manager.factory';

import {
  config,
  validationSchema,
  validationOptions,
  IAppConfig,
} from './settings/config';
import { RedisClientOptions } from 'redis';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SummonerModule } from './summoner/summoner.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
      validationOptions,
    }),
    WinstonModule.forRootAsync({
      useFactory: winstonModuleFactory,
      inject: [ConfigService<IAppConfig, true>],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: cacheManagerFactory,
      inject: [ConfigService<IAppConfig, true>],
    }),
    SummonerModule,
    MatchModule,
  ],
  providers: [
    RequestContextService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
