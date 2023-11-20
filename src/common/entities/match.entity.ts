import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Match } from '@/common/dtos/match.dto';
import { MetadataEntity } from '@/common/entities/metadata.entity';
import { SummonerEntity } from '@/common/entities/summoner.entity';
import { InfoEntity } from '@/common/entities/info.entity';

@Entity({ name: 'match' })
export class MatchEntity implements Match {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 100 })
  id: string;

  @Column({ name: 'summoner_id', type: 'varchar', length: 100, update: false })
  summonerId: string;

  @OneToOne(() => MetadataEntity, (metadata) => metadata.matchId, {
    cascade: true,
  })
  @JoinColumn({ name: 'metadata_id' })
  metadata: MetadataEntity;

  @OneToOne(() => InfoEntity, (info) => info.matchId, {
    cascade: true,
  })
  @JoinColumn({ name: 'info_id' })
  info: InfoEntity;

  @ManyToOne(() => SummonerEntity, (summoner) => summoner.match, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'summoner_id', referencedColumnName: 'id' })
  summoner: SummonerEntity;

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
