import { Logger } from 'winston';
import { Logger as OrmLogger, LoggerOptions } from 'typeorm';
import { LogLevel } from '@/common/enums';

export class TypeOrmLogger implements OrmLogger {
  constructor(
    private readonly logger: Logger,
    private readonly options: LoggerOptions,
  ) {}

  logQuery(query: string, parameters?: unknown[]) {
    if (this.options === true || this.shouldLog('query')) {
      this.logger.log(LogLevel.Info, {
        query,
        parameters,
      });
    }
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    if (this.options === true || this.shouldLog('error')) {
      this.logger.log(LogLevel.Error, {
        error,
        query,
        parameters,
      });
    }
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.log(LogLevel.Warn, {
      time,
      query,
      parameters,
    });
  }

  logSchemaBuild(message: string) {
    if (this.shouldLog('schema')) {
      this.logger.log(LogLevel.Info, message);
    }
  }

  logMigration(message: string) {
    if (this.shouldLog('migration')) {
      this.logger.log(LogLevel.Info, message);
    }
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log' && this.shouldLog(level)) {
      return this.logger.log(LogLevel.Info, message);
    } else if (level === 'info' && this.shouldLog(level)) {
      return this.logger.log(LogLevel.Info, message);
    } else if (level === 'warn' && this.shouldLog(level)) {
      return this.logger.log(LogLevel.Warn, message);
    }
  }

  private shouldLog(
    level: Exclude<LoggerOptions, 'all' | boolean>[number],
  ): boolean {
    return this.options === 'all' || this.isArrayThatIncludes(level);
  }

  private isArrayThatIncludes(
    level: Exclude<LoggerOptions, 'all' | boolean>[number],
  ): boolean {
    return Array.isArray(this.options) && this.options.includes(level);
  }
}
