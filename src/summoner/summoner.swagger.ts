import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { RegionEnum } from '@/summoner/dto/get-summoner.dto';
import { SummonerDto } from '@/common/dtos/summoner.dto';

export const SwaggerGetSummoner = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get summoner by region and name' }),
    ApiQuery({
      name: 'region',
      type: () => RegionEnum,
      enum: RegionEnum,
      example: RegionEnum.NA1,
    }),
    ApiQuery({ name: 'summonerName', type: String, example: 'TTV' }),
    ApiQuery({
      name: 'apiKey',
      type: String,
      example: 'RGAPI-3a78ef18-1365-4946-9148-d5531ba0fdba',
    }),
    ApiOkResponse({ type: SummonerDto }),
  );
