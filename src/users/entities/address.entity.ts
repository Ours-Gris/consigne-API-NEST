import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../generics/timestamp.entities';

@Entity('address')
export class AddressEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: true
    })
    address!: string;

    @Column({
        nullable: true
    })
    address_details!: string;

    @Column({
        nullable: true
    })
    postal_code!: string;

    @Column({
        nullable: true
    })
    city!: string;

    @Column({
        nullable: false,
        default: false
    })
    delivery!: boolean;
}
