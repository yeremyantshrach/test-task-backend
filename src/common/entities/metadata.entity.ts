import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Metadata } from '@/common/dtos/match.dto';
@Entity({ name: 'metadata' })
export class MetadataEntity implements Metadata {
  @PrimaryGeneratedColumn('uuid', {
    name: 'metadata_id',
  })
  metadataId: string;

  @Column({ name: 'data_version', type: 'varchar', length: 50 })
  dataVersion: string;

  @Column({ name: 'participants', type: 'varchar', array: true })
  participants: string[];

  @Column({ name: 'match_id', type: 'varchar', length: 100 })
  matchId: string;

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
