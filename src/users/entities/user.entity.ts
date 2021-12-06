import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../enums/user.role';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { UserStatus } from '../../enums/user.status';
import { AddressEntity } from './address.entity';
import { PassageEntity } from '../../passages/entities/passage.entity';
import { CollecteStatus } from '../../enums/collecte.status';
import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('user')
export class UserEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: false
    })
    username!: string;

    @Column({
        nullable: false,
        unique: true
    })
    email!: string;

    @Column({
        nullable: true
    })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role!: UserRole;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    status!: UserStatus;

    @Column({
        default: false
    })
    reseller!: boolean;

    @Column({
        default: false
    })
    producer!: boolean;

    @Column({
        default: false
    })
    collecte_point!: boolean;

    @Column({
        nullable: true
    })
    company!: string;

    @Column({
        nullable: true
    })
    tel!: string;

    @Column({
        nullable: true
    })
    delivery_schedules!: string;

    @Column({
        nullable: true
    })
    delivery_data!: string;

    @Column({
        default: false
    })
    heavy_truck!: boolean;

    @Column({
        default: false
    })
    stacker!: boolean;

    @Column({
        default: false
    })
    forklift!: boolean;

    @Column({
        default: false
    })
    pallet_truck!: boolean;

    @Column({
        nullable: true
    })
    internal_data!: string;

    @OneToOne(
        () => AddressEntity,
        { nullable: true }
    )
    @JoinColumn()
    address!: AddressEntity;

    @OneToOne(
        () => AddressEntity,
        { nullable: true }
    )
    @JoinColumn()
    delivery_address!: AddressEntity;


    @Column({
        type: 'enum',
        enum: CollecteStatus,
        default: CollecteStatus.NO_COLLECTE
    })
    collecte_status!: CollecteStatus;

    @OneToMany(
        () => PassageEntity,
        passage => passage.user,
        {
            nullable: true
        }
    )
    passages!: PassageEntity[];

    @OneToMany(
        () => OrderEntity,
        order => order.user,
        {
            nullable: true
        }
    )
    orders!: OrderEntity[];
}
