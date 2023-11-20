import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SummonerEntity,
  InfoEntity,
  MetadataEntity,
  MatchEntity,
} from '@/common/entities';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      SummonerEntity,
      InfoEntity,
      MetadataEntity,
      MatchEntity,
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
