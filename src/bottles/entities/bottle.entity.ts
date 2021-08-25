import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';

@Entity('bottle')
export class BottleEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @Column({
        nullable: false
    })
    description!: string;

    @Column({
        nullable: true
    })
    code!: string;
}
