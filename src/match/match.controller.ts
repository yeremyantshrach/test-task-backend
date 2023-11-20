import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { GetMatchesSwagger } from '@/match/match.swagger';
import { GetMatchesDto } from '@/match/dto/get-matches.dto';
import { MatchService } from '@/match/match.service';

@Controller({ version: '1', path: 'match' })
@ApiTags('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}
  @Get(':puuid')
  @GetMatchesSwagger()
  async getMatchHistory(
    @Param('puuid') puuid: string,
    @Query() query: GetMatchesDto,
    @Paginate() pagination: PaginateQuery,
  ) {
    return this.matchService.getMatchIdsByPuuid({
      ...query,
      ...pagination,
      puuid,
    });
  }
}
