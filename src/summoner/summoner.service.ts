import { Inject, Injectable } from '@nestjs/common';
import { GetSummonerDto } from '@/summoner/dto/get-summoner.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { ISummoner, SummonerDto } from '@/common/dtos/summoner.dto';
import { AxiosError } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { SummonerEntity } from '@/common/entities/summoner.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SummonerService {
  private readonly RIOT_GAMES_SUMMONER_API_URL =
    'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}';
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger;
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SummonerEntity)
    private readonly summonerEntity: Repository<SummonerEntity>,
  ) {}

  async getSummonerByNameAndRegion({
    summonerName,
    region,
    apiKey,
  }: GetSummonerDto): Promise<ISummoner> {
    const summoner = await this.summonerEntity.findOne({
      where: { name: summonerName },
    });
    if (summoner) {
      return summoner;
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get<ISummoner>(
          this.RIOT_GAMES_SUMMONER_API_URL.replace(
            /{region}/gi,
            region,
          ).replace(/{summonerName}/gi, summonerName),
          {
            params: { api_key: apiKey },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error;
          }),
        ),
    );
    const newSummoner = await this.summonerEntity.save(
      Object.assign<SummonerDto, Partial<ISummoner>>(new SummonerDto(), {
        name: data.name,
        puuid: data.puuid,
        summonerLevel: data.summonerLevel,
        id: data.id,
        accountId: data.accountId,
        profileIconId: data.profileIconId,
        revisionDate: data.revisionDate,
      }),
    );
    return newSummoner;
  }
}
