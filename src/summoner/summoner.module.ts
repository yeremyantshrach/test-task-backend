import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SummonerService } from './summoner.service';
import { SummonerController } from './summoner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonerEntity } from '@/common/entities';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SummonerEntity])],
  providers: [SummonerService],
  controllers: [SummonerController],
  exports: [SummonerService],
})
export class SummonerModule {}
