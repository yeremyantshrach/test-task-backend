import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum MatchesRegionEnum {
  AMERICAS = 'AMERICAS',
  ASIA = 'ASIA',
  SEA = 'SEA',
  EUROPE = 'EUROPE',
}

export class GetMatchesDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(MatchesRegionEnum)
  region: MatchesRegionEnum;

  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
