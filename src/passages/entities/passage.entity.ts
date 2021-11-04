import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('passages')
export class PassageEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: true,
        type: 'int'
    })
    bottles_collected: number;

    @ManyToOne(
        () => UserEntity,
        user => user.passages,
        {
            nullable: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        })
    @JoinColumn()
    user!: UserEntity;
}
