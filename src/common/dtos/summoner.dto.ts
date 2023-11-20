import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface ISummoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export class SummonerDto implements ISummoner {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  accountId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  puuid: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  profileIconId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  revisionDate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  summonerLevel: number;
}
