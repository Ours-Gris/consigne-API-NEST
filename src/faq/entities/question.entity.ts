import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';

@Entity('questions')
export class QuestionEntity extends TimestampEntities {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: false
    })
    label!: string;

    @Column({
        nullable: false,
        type: 'text'
    })
    answer!: string;
}
