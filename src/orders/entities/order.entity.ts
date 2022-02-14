import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { OrderStatus } from '../../enums/order.status';
import { UserEntity } from '../../users/entities/user.entity';
import { ItemEntity } from './item.entity';

@Entity('orders')
export class OrderEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        default: OrderStatus.PENDING_VALIDATION
    })
    order_status!: OrderStatus;

    @OneToMany(
        () => ItemEntity,
        item => item.order,
        {
            cascade: ['insert'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    )
    items: ItemEntity[];

    @ManyToOne(
        () => UserEntity,
        user => user.orders,
        {
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    )
    user: UserEntity;
}
