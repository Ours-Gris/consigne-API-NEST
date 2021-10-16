import { IsEnum, IsNotEmpty } from 'class-validator';
import { CollecteStatus } from '../../enums/collecte.status';
import { Type } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';

export class UpdateCollecteDto {

    @IsNotEmpty()
    @IsEnum(CollecteStatus)
    status!: CollecteStatus;

    @IsNotEmpty()
    @Type( () => UserEntity)
    readonly user: UserEntity;
}
