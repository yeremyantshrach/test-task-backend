import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggerOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IAppConfig } from '@/settings/config';
import { Environment } from '@/common/enums';
import { TypeOrmLogger } from './typeorm-logger';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService) private readonly config: ConfigService<
    IAppConfig,
    true
  >;
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger;
  private readonly DEFAULT_LOGGER_OPTIONS: LoggerOptions = 'all';

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('database.host', { infer: true }),
      port: this.config.get<number>('database.port', { infer: true }),
      database: this.config.get<string>('database.name', { infer: true }),
      username: this.config.get<string>('database.user', { infer: true }),
      password: this.config.get<string>('database.password', { infer: true }),
      entities: ['dist/**/*.entity.{ts,js}'],
      logger: new TypeOrmLogger(this.logger, this.DEFAULT_LOGGER_OPTIONS),
      maxQueryExecutionTime: 10000,
      migrationsRun: false,
      synchronize: this.config.get('env') !== Environment.Prod,
    };
  }
}
