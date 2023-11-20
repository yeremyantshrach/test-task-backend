import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerGetSummoner } from '@/summoner/summoner.swagger';
import { GetSummonerDto } from '@/summoner/dto/get-summoner.dto';
import { SummonerService } from '@/summoner/summoner.service';

@Controller({ version: '1', path: 'summoner' })
@ApiTags('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}
  @Get()
  @SwaggerGetSummoner()
  async getSummoner(@Query() query: GetSummonerDto) {
    return this.summonerService.getSummonerByNameAndRegion(query);
  }
}
