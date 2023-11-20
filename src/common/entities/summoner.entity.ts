import { Exclude } from 'class-transformer';
import {
  Entity,
  Index,
  Column,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ISummoner } from '@/common/dtos/summoner.dto';
import { MatchEntity } from '@/common/entities/match.entity';

@Entity({ name: 'summoner' })
export class SummonerEntity implements ISummoner {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 100 })
  id: string;

  @Column({ name: 'account_id', type: 'varchar', length: 100 })
  accountId: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  @Index('summoner_name_index', { unique: true })
  name: string;

  @Column({ name: 'profile_icon_id', type: 'int' })
  profileIconId: number;

  @Column({ name: 'puuid', type: 'varchar', length: 100 })
  puuid: string;

  @Column({ name: 'revision_date', type: 'bigint' })
  revisionDate: number;

  @Column({ name: 'summonerLevel', type: 'int' })
  summonerLevel: number;

  @OneToMany(() => MatchEntity, (match) => match.id, { cascade: true })
  match: MatchEntity[];

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
