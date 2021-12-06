import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { DeliveryStatus } from '../../enums/delivery.status';
import { UserEntity } from '../../users/entities/user.entity';
import { ItemEntity } from './item.entity';

@Entity('orders')
export class OrderEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        default: DeliveryStatus.PENDING
    })
    delivery_status!: DeliveryStatus;

    @OneToMany(
        () => ItemEntity,
        item => item.order
    )
    items: ItemEntity[];

    @ManyToOne(
        () => UserEntity,
        user => user.orders
    )
    user: UserEntity;
}
