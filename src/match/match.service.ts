import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { catchError, firstValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';

import { GetMatchesDto } from '@/match/dto/get-matches.dto';
import { Match } from '@/common/dtos/match.dto';
import {
  SummonerEntity,
  InfoEntity,
  MatchEntity,
  MetadataEntity,
} from '@/common/entities';

@Injectable()
export class MatchService {
  private readonly RIOT_GAMES_MATCH_IDS_URL =
    'https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids';
  private readonly RIOT_GAMES_MATCH_URL =
    'https://{region}.api.riotgames.com/lol/match/v5/matches/{matchId}';
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SummonerEntity)
    private readonly summonerEntityRepository: Repository<SummonerEntity>,
    @InjectRepository(MatchEntity)
    private readonly matchEntityRepository: Repository<MatchEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getMatchIdsByPuuid({
    region,
    puuid,
    apiKey,
    ...rest
  }: GetMatchesDto & { puuid: string } & PaginateQuery) {
    const result = await this.matchEntityRepository.exist({
      where: { summoner: { puuid: puuid } },
    });
    if (result) {
      return paginate<MatchEntity>(
        { ...rest, select: ['*'] },
        this.matchEntityRepository,
        {
          where: { summoner: { puuid: puuid } },
          relations: { metadata: true, info: true },
          sortableColumns: ['id'],
          defaultSortBy: [['id', 'DESC']],
        },
      );
    }
    const ids = await this.getMatchIdsFromService({ region, puuid, apiKey });
    for (const id of ids) {
      await this.getMatchHistoryById(id, apiKey, region, puuid);
    }
    return paginate<MatchEntity>(
      { ...rest, select: ['*'] },
      this.matchEntityRepository,
      {
        where: { summoner: { puuid: puuid } },
        relations: { metadata: true, info: true },
        sortableColumns: ['id'],
        defaultSortBy: [['id', 'DESC']],
      },
    );
  }

  async getMatchIdsFromService({
    region,
    puuid,
    apiKey,
  }: GetMatchesDto & { puuid: string }) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<string[]>(
          this.RIOT_GAMES_MATCH_IDS_URL.replace(/{region}/gi, region).replace(
            /{puuid}/gi,
            puuid,
          ),
          {
            params: { start: 0, count: 20, api_key: apiKey },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async getMatchHistoryById(
    matchId: string,
    apiKey: string,
    region: string,
    puuid: string,
  ) {
    const match = await this.matchEntityRepository.exist({
      where: { id: matchId },
    });
    if (!match) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const { data } = await firstValueFrom(
          this.httpService
            .get<Match>(
              this.RIOT_GAMES_MATCH_URL.replace(/{region}/gi, region).replace(
                /{matchId}/gi,
                matchId,
              ),
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
        const metadata = await queryRunner.manager.save(
          Object.assign<MetadataEntity, Partial<MetadataEntity>>(
            new MetadataEntity(),
            {
              matchId,
              dataVersion: data.metadata.dataVersion,
              participants: data.metadata.participants,
            },
          ),
        );
        const info = await queryRunner.manager.save(
          Object.assign<InfoEntity, Partial<InfoEntity>>(new InfoEntity(), {
            matchId,
            ...data.info,
          }),
        );
        const summoner = await this.summonerEntityRepository.findOne({
          where: { puuid },
        });
        await queryRunner.manager.save(
          Object.assign<MatchEntity, Partial<MatchEntity>>(new MatchEntity(), {
            info,
            metadata,
            id: matchId,
            summonerId: summoner.id,
          }),
        );
        await queryRunner.commitTransaction();
        await queryRunner.release();
      } catch (e) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    }
  }
}
