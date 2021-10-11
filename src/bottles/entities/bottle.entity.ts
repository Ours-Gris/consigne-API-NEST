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

    @Column({
        default: 0,
        type: 'float'
    })
    price!: number;

    @Column({
        default: 0
    })
    nbr_by_palette!: number;

    @Column({
        default: 0
    })
    internal_stock!: number;

    @Column({
        nullable: true
    })
    img_original_name!: string;

    @Column({
        nullable: true
    })
    img_name!: string;

    @Column({
        nullable: true
    })
    pdf_original_name!: string;

    @Column({
        nullable: true
    })
    pdf_name!: string;
}
