import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { ItemEntity } from '../../orders/entities/item.entity';

@Entity('materials')
export class MaterialEntity extends TimestampEntities {

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
        default: 0
    })
    price!: number;

    @Column({
        nullable: true
    })
    code!: string;

    @Column({
        default: '0'
    })
    internal_stock!: string;

    @Column({
        nullable: true
    })
    img_original_name!: string;

    @Column({
        nullable: true
    })
    img_name!: string;

    @ManyToOne(
        () => ItemEntity,
        item => item.material
    )
    items: ItemEntity[];
}
