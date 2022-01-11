import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';

@Entity('news')
export class NewsEntity extends TimestampEntities {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: false
    })
    title!: string;

    @Column({
        nullable: true,
        type: 'text'
    })
    subtitle!: string;

    @Column({
        nullable: false,
        type: 'text'
    })
    content!: string;

    @Column({
        nullable: true
    })
    link!: string;

    @Column({
        nullable: true
    })
    img_original_name!: string;

    @Column({
        nullable: true
    })
    img_name!: string;
}
