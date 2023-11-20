import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Info, Participant, Team } from '@/common/dtos/match.dto';

@Entity({ name: 'info' })
export class InfoEntity implements Info {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'match_id' })
  matchId: string;

  @Column({ name: 'game_creation', type: 'bigint' })
  gameCreation: number;

  @Column({ name: 'game_duration', type: 'bigint' })
  gameDuration: number;

  @Column({ name: 'game_end_timestamp', type: 'bigint' })
  gameEndTimestamp: number;

  @Column({ name: 'game_id', type: 'bigint' })
  gameId: number;

  @Column({ name: 'game_mode', type: 'varchar' })
  gameMode: string;

  @Column({ name: 'game_name', type: 'varchar' })
  gameName: string;

  @Column({ name: 'game_start_timestamp', type: 'bigint' })
  gameStartTimestamp: number;

  @Column({ name: 'game_type', type: 'varchar' })
  gameType: string;

  @Column({ name: 'game_version', type: 'varchar' })
  gameVersion: string;

  @Column({ name: 'map_id', type: 'bigint' })
  mapId: number;

  @Column({ name: 'platform_id', type: 'varchar' })
  platformId: string;

  @Column({ name: 'queue_id', type: 'bigint' })
  queueId: number;

  @Column({ name: 'tournament_code', type: 'varchar' })
  tournamentCode: string;

  @Column({ name: 'teams', type: 'json' })
  teams: Team[];

  @Column({ name: 'participants', type: 'json' })
  participants: Participant[];

  @Exclude()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'last_updated_at',
    type: 'timestamp',
    select: false,
  })
  updatedAt: Date;
}
