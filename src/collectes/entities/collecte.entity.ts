import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { CollecteStatus } from '../../enums/collecte.status';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('collectes')
export class CollecteEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'enum',
        enum: CollecteStatus,
        default: CollecteStatus.IN_FILLING
    })
    status!: CollecteStatus;

    @Column({
        nullable: true,
        type: 'int'
    })
    bottles_collected: number;

    @ManyToOne(
        () => UserEntity,
        user => user.collectes,
        { nullable: false})
    @JoinColumn()
    user!: UserEntity;
}
