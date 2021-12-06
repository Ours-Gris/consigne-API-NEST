import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { MaterialEntity } from '../../materials/entities/material.entity';
import { OrderEntity } from './order.entity';

@Entity('items')
export class ItemEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        default: 0
    })
    price!: number;

    @Column({
        default: 0
    })
    quantity!: number;

    @ManyToOne(
        () => MaterialEntity,
        material => material.items
    )
    material: MaterialEntity;

    @ManyToOne(
        () => OrderEntity,
        order => order.items
    )
    order: OrderEntity;
}
