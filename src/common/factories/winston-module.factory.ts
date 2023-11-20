import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@/settings/config';
import { format, transports } from 'winston';
import { utilities, WinstonModuleOptions } from 'nest-winston';

export const winstonModuleFactory = (
  configService: ConfigService<IAppConfig, true>,
): WinstonModuleOptions => ({
  format: format.json(),
  transports: [
    new transports.Console(
      configService.get('env') === 'local'
        ? {
            format: utilities.format.nestLike('riot games API', {
              prettyPrint: true,
            }),
          }
        : {},
    ),
  ],
});
