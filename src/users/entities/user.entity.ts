import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../enums/user.role';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { UserStatus } from '../../enums/user.status';
import { AddressEntity } from './address.entity';

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
}
