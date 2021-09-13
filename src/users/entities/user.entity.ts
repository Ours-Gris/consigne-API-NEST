import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../enums/user.role';
import { TimestampEntities } from '../../generics/timestamp.entities';
import { UserStatus } from '../../enums/user.status';

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
        nullable: false
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
    adress!: string;

    @Column({
        nullable: true
    })
    adress_details!: string;

    @Column({
        nullable: true
    })
    postal_code!: string;

    @Column({
        nullable: true
    })
    city!: string;

    @Column({
        nullable: true
    })
    tel!: string;
}
