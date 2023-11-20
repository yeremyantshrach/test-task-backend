import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ApiPaginationQuery } from 'nestjs-paginate';
import { MatchesRegionEnum } from '@/match/dto/get-matches.dto';

export const GetMatchesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get summoner by region and name' }),
    ApiParam({
      name: 'puuid',
      type: String,
      example:
        'fgUZNEfS0BBrpK7cuq54nRLzrJ0ogs9Cxt_nxf2Tlniz6NXnaSJmrTPralGzBmnJSDgjC6wVmTXg0A',
    }),
    ApiQuery({
      name: 'region',
      type: () => MatchesRegionEnum,
      enum: MatchesRegionEnum,
      example: MatchesRegionEnum.AMERICAS,
    }),
    ApiQuery({
      name: 'apiKey',
      type: String,
      example: 'RGAPI-3a78ef18-1365-4946-9148-d5531ba0fdba',
    }),
    ApiPaginationQuery({
      sortableColumns: ['id'],
      nullSort: 'last',
      filterableColumns: { queueId: true },
    }),
  );
